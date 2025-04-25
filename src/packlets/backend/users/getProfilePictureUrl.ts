import { ObjectId } from 'mongodb'
import { TRPCError } from '@trpc/server'
import { collections } from '$constants/mongo'

/**
 * Retrieve profile picture URL for a specific user by ID
 * Only returns the avatar URL, no other user information
 */
export async function getProfilePictureUrl(userId: string): Promise<string> {
  // Validate that the userId is a valid ObjectId
  if (!ObjectId.isValid(userId)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid user ID format',
    })
  }

  // Find the user by ID
  const user = await collections.users.findOne(
    { _id: new ObjectId(userId) },
    { projection: { avatar: 1 } } // Only retrieve the avatar field
  )

  // If user not found, throw error
  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found',
    })
  }

  // Return avatar URL
  return user.avatar
}