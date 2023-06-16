import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import _ from 'lodash'

import { collections } from '$constants/mongo'
import { g0Hostname } from '$constants/secrets/g0Hostname'

import { checkAccess } from './checkAccess'
import { getServiceAccountIdToken } from './getServiceAccountIdToken'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'

const GardenZeroResponse = z.object({
  accessKey: z.string(),
  createdAt: z.string(),
  expiresAt: z.string(),
})
type GardenZeroResponse = z.infer<typeof GardenZeroResponse>

export const createAccessQrCode = async (user: AuthenticatedUser | null) => {
  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in.',
    })
  }

  if (!(await checkAccess(user)).granted) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have permission.',
    })
  }

  const userDoc = await collections.users.findOne({ uid: user.uid })
  if (!userDoc) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'User not found in database. This should not happen.',
    })
  }

  const accessDoc = await collections.gardenAccesses.insertOne({
    user: userDoc._id,
    accessKey: null,
    requestedAt: new Date(),
    createdAt: null,
    expiresAt: null,
    usedAt: {},
    notifiedAt: {},
  })

  const userFirstName = user.name.split(' ')[0]
  const prefixedName =
    userFirstName.match(/^[A-Za-z0-9]+$/) !== null
      ? userFirstName.slice(0, 6)
      : user.uid.toString()

  try {
    const idToken = await getServiceAccountIdToken(
      'https://github.com/creatorsgarten/garden-gate'
    )
    const gardenZeroResponse = await fetch(g0Hostname + '/access/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
      body: JSON.stringify({
        userId: String(userDoc._id),
        prefix: prefixedName,
        accessId: String(accessDoc.insertedId),
      }),
    }).then(async o => {
      if (o.ok) return GardenZeroResponse.parse(await o.json())
      else
        throw new Error(
          `Unable to generate access: ${o.status} ${
            o.statusText
          } ${await o.text()}`
        )
    })

    await collections.gardenAccesses.updateOne(
      { _id: accessDoc.insertedId },
      {
        $set: {
          accessKey: gardenZeroResponse.accessKey,
          createdAt: new Date(gardenZeroResponse.createdAt),
          expiresAt: new Date(gardenZeroResponse.expiresAt),
        },
      }
    )

    return gardenZeroResponse
  } catch (e) {
    throw new Error('server-offline')
  }
}