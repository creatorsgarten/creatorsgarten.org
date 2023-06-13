import { TRPCError } from '@trpc/server'
import { GoogleAuth } from 'google-auth-library'
import { z } from 'zod'
import { groupBy, pick } from 'lodash'

import { mongo } from '$constants/mongo'
import { g0Hostname } from '$constants/secrets/g0Hostname'

import { notify } from './gardenZero/notify'

import type { ObjectId, WithId } from 'mongodb'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'

interface EntryLog {
  user: ObjectId
  accessKey: string | null
  requestedAt: Date
  createdAt: Date | null
  expiresAt: Date | null
  usedAt: Record<string, Date>
  notifiedAt: Record<string, Date>
}

/**
 * @param {string} audience
 */
async function getServiceAccountIdToken(audience: string) {
  const auth = new GoogleAuth()
  const client = await auth.getClient()
  if (!('fetchIdToken' in client)) throw new Error('No fetchIdToken')
  const token = await client.fetchIdToken(audience)
  return token
}

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

export async function pullLogs() {
  const idToken = await getServiceAccountIdToken(
    'https://github.com/creatorsgarten/garden-gate'
  )

  interface PullResponse {
    entries: {
      door: string
      accessKey: string
      usedAt: string
    }[]
  }

  const pullResponse = await fetch(g0Hostname + '/access/log', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
  })
    .then(o => {
      if (o.ok) return o.json() as Promise<PullResponse>
      else throw o
    })
    .catch(async (o: Response) => {
      console.error(await o.text())
      return {
        entries: [],
      }
    })
    .then(o => {
      return {
        entries: o.entries.map(p => ({
          ...p,
          usedAt: new Date(p.usedAt),
        })),
      }
    })
    .then(o =>
      o.entries.sort((a, b) => b.usedAt.valueOf() - a.usedAt.valueOf())
    )

  // group entry by accessKeys (case multiple doors)
  await Promise.allSettled(
    Object.entries(groupBy(pullResponse, o => o.accessKey)).map(
      async ([accessKey, entries]) => {
        // find access object by access key
        let accessDoc = (await mongo
          .db('creatorsgarten-org')
          .collection('gardenAccesses')
          .findOne({
            accessKey: accessKey,
          })) as WithId<EntryLog>
        let userDoc = (await mongo
          .db('creatorsgarten-org')
          .collection('users')
          .findOne({
            _id: accessDoc.user,
          })) as WithId<AuthenticatedUser>

        if (accessDoc === null || userDoc === null) return

        // mongo will transformed into null
        if (accessDoc.usedAt === null) accessDoc.usedAt = {}
        if (accessDoc.notifiedAt === null) accessDoc.notifiedAt = {}

        // update log of when it has been used
        for (const entry of entries) {
          if (accessDoc.usedAt[entry.door] === undefined) {
            accessDoc.usedAt[entry.door] = entry.usedAt
          }
        }

        // loop again but now notifies channels about doors
        await Promise.allSettled(
          entries
            .filter(entry => accessDoc.notifiedAt[entry.door] === undefined)
            .map(async entry => {
              try {
                await notify(userDoc, entry.door, entry.usedAt)
                accessDoc.notifiedAt[entry.door] = new Date()
              } catch (e) {}
            })
        )

        await mongo
          .db('creatorsgarten-org')
          .collection('gardenAccesses')
          .updateOne(
            { _id: accessDoc._id },
            {
              $set: pick(accessDoc, ['usedAt', 'notifiedAt']),
            }
          )
          .catch(e => console.error(e))
      }
    )
  )
}
