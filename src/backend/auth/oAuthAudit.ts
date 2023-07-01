import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

import { getAuthenticatedUser } from './getAuthenticatedUser'
import { collections } from '$constants/mongo'

export const auditInputSchema = z.object({
  clientId: z.string(),
  redirectUri: z.string(),
  scopes: z.array(z.string()),
})

export const checkOAuthAudit = async (
  authToken: string | undefined,
  input: z.infer<typeof auditInputSchema>
) => {
  const user = await getAuthenticatedUser(authToken)
  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User is not authenticated',
    })
  }

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
  input: z.infer<typeof auditInputSchema>
) => {
  const user = await getAuthenticatedUser(authToken)
  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User is not authenticated',
    })
  }

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
