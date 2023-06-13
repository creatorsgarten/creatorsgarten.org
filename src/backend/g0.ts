import { mongo } from '$constants/mongo'
import { g0Hostname } from '$constants/secrets/g0Hostname'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const GardenZeroResponse = z.object({
  accessKey: z.string(),
  createdAt: z.string(),
  expiresAt: z.string(),
})
type GardenZeroResponse = z.infer<typeof GardenZeroResponse>

export async function checkAccess(user: AuthenticatedUser | null) {
  if (!user) {
    return { granted: false, reason: 'You are not logged in.' }
  }
  return {
    granted: [
      'rayriffy',
      'dtinth',
      'heypoom',
      'chayapatr',
      'leomotors',
      'chunrapeepat',
      'narze',
      'betich',
      'amiphaphadha',
      'pavitpim40',
      'jabont',
      'ibsfb',
      'saltyaom',
      'panj',
    ].includes(user.connections.github?.username.toLowerCase() ?? ''),
    reason: 'TODO',
  }
}

export async function createAccessQrCode(user: AuthenticatedUser | null) {
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
      createdAt: new Date(),
    })

  const userFirstName = user.name.split(' ')[0]
  const prefixedName =
    userFirstName.match(/^[A-Za-z0-9]+$/) !== null
      ? userFirstName.slice(0, 6)
      : user.uid.toString()

  try {
    const gardenZeroResponse = await fetch(g0Hostname + '/access/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer dummy',
      },
      body: JSON.stringify({
        userId: userDoc!._id,
        prefix: prefixedName,
        accessId: String(accessDoc.insertedId),
      }),
    }).then(async o => {
      console.log(await o.text())
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
          },
        }
      )

    return gardenZeroResponse
  } catch (e) {
    throw new Error('server-offline')
  }
}
