import _ from 'lodash'

import { g0Hostname } from '$constants/secrets/g0Hostname'
import { collections, mongo } from '$constants/mongo'

import { getServiceAccountIdToken } from './getServiceAccountIdToken'
import { notify } from './notify'

import type { WithId } from 'mongodb'
import type { GardenAccess } from '$types/mongo/GardenAccess'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'

interface PullResponse {
  entries: {
    door: string
    accessKey: string
    usedAt: string
  }[]
}

export const pullLogs = async () => {
  const idToken = await getServiceAccountIdToken(
    'https://github.com/creatorsgarten/garden-gate'
  )

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
    Object.entries(_.groupBy(pullResponse, o => o.accessKey)).map(
      async ([accessKey, entries]) => {
        // find access object by access key
        const accessDoc = await collections.gardenAccesses.findOne({
          accessKey: accessKey,
        })
        if (!accessDoc) return

        const userDoc = await collections.users.findOne({
          _id: accessDoc.user,
        })
        if (!userDoc) return

        // mongo will transformed into null
        accessDoc.usedAt ??= {}
        accessDoc.notifiedAt ??= {}

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

        await collections.gardenAccesses
          .updateOne(
            { _id: accessDoc._id },
            { $set: _.pick(accessDoc, ['usedAt', 'notifiedAt']) }
          )
          .catch(e => console.error(e))
      }
    )
  )
}
