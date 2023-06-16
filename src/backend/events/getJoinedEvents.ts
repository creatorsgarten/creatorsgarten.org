import { ObjectId } from 'mongodb'
import { mongo } from '$constants/mongo'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { TRPCError } from '@trpc/server'

export async function getJoinedEvents(user: AuthenticatedUser | null) {
  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in.',
    })
  }
  const row = await mongo
    .db('creatorsgarten-org')
    .collection<{ events: { id: number; ticketId: number; code: string }[] }>(
      'users'
    )
    .findOne({ _id: new ObjectId(user.sub) })
  return row?.events || []
}
