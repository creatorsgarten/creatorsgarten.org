import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import _ from 'lodash'

import { mongo } from '$constants/mongo'
import { g0Hostname } from '$constants/secrets/g0Hostname'

import { checkAccess } from './checkAccess'
import { getServiceAccountIdToken } from './getServiceAccountIdToken'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import type { EntryLog } from '$types/EntryLog'

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

  // get user object
  const userDoc = await mongo
    .db('creatorsgarten-org')
    .collection('users')
    .findOne({
      uid: user.uid,
    })

  const accessDoc = await mongo
    .db('creatorsgarten-org')
    .collection('gardenAccesses')
    .insertOne({
      user: userDoc!._id,
      accessKey: null,
      requestedAt: new Date(),
      createdAt: null,
      expiresAt: null,
      usedAt: {},
      notifiedAt: {},
    } satisfies EntryLog)

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
        userId: String(userDoc!._id),
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

    await mongo
      .db('creatorsgarten-org')
      .collection('gardenAccesses')
      .updateOne(
        { _id: accessDoc.insertedId },
        {
          $set: {
            accessKey: gardenZeroResponse.accessKey,
            createdAt: new Date(gardenZeroResponse.createdAt),
            expiresAt: new Date(gardenZeroResponse.expiresAt),
          } satisfies Partial<EntryLog>,
        }
      )

    return gardenZeroResponse
  } catch (e) {
    throw new Error('server-offline')
  }
}