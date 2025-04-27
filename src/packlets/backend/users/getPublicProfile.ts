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
 * Normalize a username by removing @ prefix and converting to lowercase
 */
function normalizeUsername(username: string): string {
  return username.replace(/^@/, '').toLowerCase()
}

/**
 * Resolve usernames to user IDs
 */
async function resolveUserIdsFromUsernames(usernames: string[]): Promise<{ id: string; username: string }[]> {
  if (!usernames.length) return []
  
  // Normalize usernames (strip @ and convert to lowercase)
  const normalizedUsernames = usernames.map(normalizeUsername)
  
  // Find users by usernames
  const users = await collections.users.find(
    { username: { $in: normalizedUsernames } },
    { projection: { _id: 1, username: 1 } }
  ).toArray()
  
  // Map to id and username pairs
  return users.map(user => ({
    id: user._id.toString(),
    username: user.username || '',
  }))
}

/**
 * Get public profiles for multiple users by their IDs or usernames
 */
export async function getPublicProfiles(userIdentifiers: string[]): Promise<PublicProfile[]> {
  if (!userIdentifiers.length) return []
  
  // Separate IDs and usernames
  const objectIdCandidates: string[] = []
  const usernameCandidates: string[] = []
  
  userIdentifiers.forEach(identifier => {
    if (identifier.startsWith('@')) {
      usernameCandidates.push(identifier)
    } else if (ObjectId.isValid(identifier)) {
      objectIdCandidates.push(identifier)
    } else {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid identifier format: ${identifier}. Must be a valid ObjectId or username with @ prefix.`,
      })
    }
  })
  
  // Resolve usernames to IDs
  const resolvedFromUsernames = await resolveUserIdsFromUsernames(usernameCandidates)
  
  // Combine all ObjectIds
  const allIds = [
    ...objectIdCandidates,
    ...resolvedFromUsernames.map(item => item.id)
  ]
  
  // If no valid IDs after resolution, return empty array
  if (!allIds.length) return []
  
  // Convert string IDs to ObjectIds
  const objectIds = allIds.map(id => new ObjectId(id))
  
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
    query.username = normalizeUsername(username)
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
