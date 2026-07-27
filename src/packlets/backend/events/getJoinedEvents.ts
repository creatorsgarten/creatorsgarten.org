import { ObjectId } from 'mongodb'
import { collections } from '$constants/mongo'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { ApiError } from '../apiError'

export async function getJoinedEvents(user: AuthenticatedUser | null) {
  if (!user) {
    throw new ApiError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in.',
    })
  }
  const row = await collections.users.findOne({ _id: new ObjectId(user.sub) })
  return row?.events || []
}
