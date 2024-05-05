import dayjs from 'dayjs'
import { ObjectId } from 'mongodb'
import type { Static } from 'elysia'

import { getAuthenticatedUser } from './getAuthenticatedUser.ts'
import { collections } from '$constants/mongo.ts'
import { auditInputSchema } from './models.ts'

export const checkOAuthAudit = async (
  authToken: string | undefined,
  input: Static<typeof auditInputSchema>
) => {
  const user = (await getAuthenticatedUser(authToken))!

  const audit = await collections.oAuthAudits.findOne({
    clientId: input.clientId,
    redirectUri: input.redirectUri,
    user: new ObjectId(user.sub),
    scopes: {
      $all: input.scopes.map(scope => ({ $elemMatch: { $eq: scope } })),
    },
  })

  // TODO: revoke audit if authorized older than 3 months
  if (audit === null) {
    return false
  } else {
    const oldestAuthorizedTime = dayjs().subtract(3, 'month')
    return oldestAuthorizedTime.isBefore(audit.authorizedAt)
  }
}

export const recordOAuthAudit = async (
  authToken: string | undefined,
  input: Static<typeof auditInputSchema>
) => {
  const user = (await getAuthenticatedUser(authToken))!

  await collections.oAuthAudits.updateOne(
    {
      clientId: input.clientId,
      redirectUri: input.redirectUri,
      user: new ObjectId(user.sub),
      scopes: {
        $all: input.scopes.map(scope => ({ $elemMatch: { $eq: scope } })),
      },
    },
    {
      $set: {
        clientId: input.clientId,
        redirectUri: input.redirectUri,
        user: new ObjectId(user.sub),
        scopes: input.scopes,
        authorizedAt: new Date(),
      },
    },
    {
      upsert: true,
    }
  )
}
