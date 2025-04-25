import { getPublicProfile } from './getPublicProfile'

/**
 * Retrieve profile picture URL for a specific user by ID
 * Only returns the avatar URL, no other user information
 */
export async function getProfilePictureUrl(userId: string): Promise<string> {
  const profile = await getPublicProfile({ userId })
  return profile.profilePictureUrl
}