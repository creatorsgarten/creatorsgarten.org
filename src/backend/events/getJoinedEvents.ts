import { ObjectId } from 'mongodb'
import { collections } from '$constants/mongo.ts'
import type { AuthenticatedUser } from '$types/AuthenticatedUser.ts'

export async function getJoinedEvents(user: AuthenticatedUser) {
  const row = await collections.users.findOne({ _id: new ObjectId(user.sub) })
  return row?.events || []
}
