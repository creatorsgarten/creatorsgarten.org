import { contentsgarten } from '$constants/contentsgarten'
import { collections } from '$constants/mongo'
import {
  frontMatterSchema,
  type FrontMatter,
} from '$functions/parseFrontMatter'
import type { User } from '$types/mongo/User'
import { TRPCError } from '@trpc/server'
import { ObjectId, type WithId } from 'mongodb'

/**
 * Public profile information for a user
 */
export interface PublicProfile {
  id: string
  username?: string
  profilePictureUrl: string
  profileInformation?: FrontMatter['person']
}

/**
 * Resolve public profiles for multiple users
 */
export async function resolvePublicProfiles(
  users: WithId<User>[]
): Promise<PublicProfile[]> {
  if (!users.length) return []

  // Extract usernames for batch lookup
  const usernames = users
    .map(user => user.username)
    .filter((username): username is string => !!username)

  // Define a local type for profile data
  type ProfileData = {
    avatar?: string
    profileInformation?: FrontMatter['person']
  }

  // Batch fetch profile information from Contentsgarten
  const profilesInfo = new Map<string, ProfileData>()

  if (usernames.length) {
    try {
      const pageRefs = usernames.map(username => `People/${username}`)
      const searchResults = await contentsgarten().search.query({
        pageRef: pageRefs,
      })

      // Process results
      for (const page of searchResults.results) {
        const pageName = page.pageRef.split('/')[1]
        if (!pageName) continue

        try {
          const frontMatter = frontMatterSchema.parse(page.frontMatter)
          const profileData: ProfileData = {
            profileInformation: frontMatter.person,
          }

          if (frontMatter.image) {
            const url = new URL(frontMatter.image)
            if (
              url.protocol === 'https:' &&
              url.hostname === 'usercontent.creatorsgarten.org'
            ) {
              profileData.avatar = frontMatter.image
            }
          }

          profilesInfo.set(pageName, profileData)
        } catch (error) {
          console.error(`Error parsing frontmatter for ${pageName}:`, error)
        }
      }
    } catch (error) {
      console.error('Error fetching user data from Contentsgarten:', error)
    }
  }

  // Map users to public profiles
  return users.map(user => {
    const username = user.username
    const userProfile = username ? profilesInfo.get(username) : undefined

    return {
      id: user._id.toString(),
      username: user.username,
      profilePictureUrl: userProfile?.avatar || user.avatar,
      profileInformation: userProfile?.profileInformation,
    }
  })
}

/**
 * Get public profiles for multiple users by their IDs
 */
export async function getPublicProfiles(userIds: string[]): Promise<PublicProfile[]> {
  if (!userIds.length) return []
  
  // Validate user IDs
  const validIds = userIds.filter(id => ObjectId.isValid(id))
  if (validIds.length !== userIds.length) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'One or more invalid user IDs provided',
    })
  }
  
  // Convert string IDs to ObjectIds
  const objectIds = validIds.map(id => new ObjectId(id))
  
  // Find all users in a single query
  const users = await collections.users.find(
    { _id: { $in: objectIds } },
    { projection: { _id: 1, username: 1, avatar: 1 } }
  ).toArray()
  
  // Use the batch function to resolve profiles
  return resolvePublicProfiles(users)
}

export async function getPublicProfile({
  userId,
  username,
}: {
  userId?: string
  username?: string
}): Promise<PublicProfile> {
  if (!userId && !username) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Either userId or username must be provided',
    })
  }

  const query: Record<string, any> = {}

  if (userId) {
    if (!ObjectId.isValid(userId)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid user ID format',
      })
    }
    query._id = new ObjectId(userId)
  } else if (username) {
    query.username = username.toLowerCase()
  }

  // Find the user
  const user = await collections.users.findOne(query, {
    projection: { _id: 1, username: 1, avatar: 1 },
  })

  // If user not found, throw error
  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found',
    })
  }

  // Use the batch function to resolve the profile
  const [profile] = await resolvePublicProfiles([user])
  return profile
}
