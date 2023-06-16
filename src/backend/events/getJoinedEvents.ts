import { ObjectId } from 'mongodb'
import { collections } from '$constants/mongo'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { TRPCError } from '@trpc/server'

export async function getJoinedEvents(user: AuthenticatedUser | null) {
  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in.',
    })
  }
  const row = await collections.users.findOne({ _id: new ObjectId(user.sub) })
  return row?.events || []
}
