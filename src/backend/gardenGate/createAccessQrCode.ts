import { t, type Static, type Handler } from 'elysia'

import { collections } from '$constants/mongo.ts'
import { g0Hostname } from '$constants/secrets/g0Hostname.ts'

import { getServiceAccountIdToken } from './getServiceAccountIdToken.ts'

import type { WithId } from 'mongodb'
import type { User } from '$types/mongo/User'
import type { AuthenticatedUser } from '$types/AuthenticatedUser.ts'

const GardenZeroResponse = t.Object({
  accessKey: t.String(),
  createdAt: t.String(),
  expiresAt: t.String(),
})
type GardenZeroResponse = Static<typeof GardenZeroResponse>

type Set = Parameters<Handler>[0]['set']

export const createAccessQrCode = async (
  user: AuthenticatedUser,
  userDoc: WithId<User>,
  set: Set
) => {
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
    userFirstName.match(/^[A-Za-z]+$/) !== null
      ? userFirstName.slice(0, 6)
      : (user.email.replace(/@.+/, '') + user.uid.toString()).replace(
          /[^a-zA-Z]/g,
          ''
        )

  try {
    const idToken = await getServiceAccountIdToken(
      'https://github.com/creatorsgarten/garden-gate'
    )
    const gardenZeroResponse: GardenZeroResponse = await fetch(
      g0Hostname + '/access/generate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + idToken,
        },
        body: JSON.stringify({
          userId: String(userDoc._id),
          prefix: prefixedName.slice(0, 9),
          accessId: String(accessDoc.insertedId),
        }),
      }
    )
      .then(async o => {
        if (o.ok) return GardenZeroResponse.parse(await o.json())
        else
          throw new Error(
            `Unable to generate access: ${o.status} ${
              o.statusText
            } ${await o.text()}`
          )
      })
      .catch(async e => {
        await collections.gardenAccesses.deleteOne({
          _id: accessDoc.insertedId,
        })
        throw e
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
    set.status = 500

    if (e instanceof Error) return e.message ?? ''
    else return 'server-offline'
  }
}
