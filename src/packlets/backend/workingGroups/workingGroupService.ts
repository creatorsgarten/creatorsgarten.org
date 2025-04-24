import { TRPCError } from '@trpc/server'
import crypto from 'crypto'
import { ObjectId, type WithId } from 'mongodb'
import { z } from 'zod'

import { collections } from '$constants/mongo'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import type { WorkingGroup } from '$types/mongo/WorkingGroup'
import type {
  ProfileSnapshot,
  WorkingGroupMember,
} from '$types/mongo/WorkingGroupMember'

// Working group name schema for validation
export const workingGroupNameSchema = z
  .string()
  .min(3, 'Group name must be at least 3 characters')
  .max(30, 'Group name must be at most 30 characters')
  .regex(
    /^[a-z0-9-]+$/,
    'Group name must contain only lowercase letters, numbers, and hyphens'
  )

// Required connections for joining working groups
export const REQUIRED_CONNECTIONS = ['github', 'figma', 'google']

// Display names for connection types
const CONNECTION_DISPLAY_NAMES: Record<string, string> = {
  github: 'GitHub',
  figma: 'Figma',
  google: 'Google',
  discord: 'Discord'
}

// API representation types - explicitly defining what we expose through the API
interface PublicWorkingGroupInformation {
  id: string
  name: string
  createdAt: string
  memberCounts: {
    admins: number
    members: number
    total: number
  }
}

interface WorkingGroupMemberDTO {
  id: string
  userId: string
  joinedAt: string
  profileSnapshot: ProfileSnapshot
}

interface InviteKeyDTO {
  key: string
  enabled: boolean
  createdAt: string
  createdBy: string
}

interface WorkingGroupDetailedResponse {
  publicWorkingGroupInformation: PublicWorkingGroupInformation
  isCurrentUserAdmin: boolean
  isCurrentUserMember: boolean
  admins?: string[]
  members?: WorkingGroupMemberDTO[]
  inviteKeys?: InviteKeyDTO[]
}

interface JoinRequirement {
  type: string      // 'connection', 'profile', etc.
  name: string      // specific requirement name (e.g., 'github', 'email')
  met: boolean      // whether the requirement is met
  displayName: string // human-readable name for display
  callToAction?: {
    text: string
    url: string
  }
}

interface JoinabilityResult {
  canJoin: boolean
  group: {
    id: string
    name: string
  }
  userIsAlreadyMember: boolean
  requirements: JoinRequirement[]
  profileSnapshot: ProfileSnapshot
  errorMessage?: string
}

/**
 * Get working group details with information based on user role
 * 
 * @param name Group name
 * @param user Optional authenticated user (null for public view)
 * @returns Combined working group information based on user's role
 */
export async function getWorkingGroupWithDetails(
  name: string,
  user?: AuthenticatedUser | null
): Promise<WorkingGroupDetailedResponse | null> {
  const group = await collections.workingGroups.findOne({
    name: name.toLowerCase(),
  })

  if (!group) return null

  // Get member information
  const members = await collections.workingGroupMembers
    .find({ groupId: group._id })
    .toArray()

  // Calculate counts
  const adminCount = group.admins.length
  const memberCount = members.length
  
  // Default to public view with minimal information
  const result: WorkingGroupDetailedResponse = {
    publicWorkingGroupInformation: {
      id: group._id.toString(),
      name: group.name,
      createdAt: group.createdAt.toISOString(),
      memberCounts: {
        admins: adminCount,
        members: memberCount - adminCount,
        total: memberCount,
      },
    },
    isCurrentUserAdmin: false,
    isCurrentUserMember: false
  }
  
  // If no user provided, return public view only
  if (!user) {
    return result
  }
  
  const userId = new ObjectId(user.sub)
  
  // Check user roles
  const isAdmin = group.admins.some(adminId => adminId.equals(userId))
  const isMember = await isUserMemberOfGroup(group._id, userId)
  
  // Update result with user-specific information
  result.isCurrentUserAdmin = isAdmin
  result.isCurrentUserMember = isMember
  
  // If user is a member or admin, provide additional information
  if (isMember || isAdmin) {
    result.admins = group.admins.map(id => id.toString())
    result.members = members.map(transformMemberToDTO)
  }
  
  // If user is an admin, provide admin-specific information
  if (isAdmin) {
    result.inviteKeys = group.inviteKeys.map(key => ({
      key: key.key,
      enabled: key.enabled,
      createdAt: key.createdAt.toISOString(),
      createdBy: key.createdBy.toString(),
    }))
  }
  
  return result
}

/**
 * Get member counts for a working group
 */
async function getMemberCounts(groupId: ObjectId) {
  const group = await collections.workingGroups.findOne({ _id: groupId })
  if (!group) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Working group not found',
    })
  }

  const members = await collections.workingGroupMembers
    .find({ groupId })
    .toArray()

  const adminCount = group.admins.length
  const memberCount = members.length - adminCount

  return {
    admins: adminCount,
    members: memberCount,
    total: members.length,
  }
}

/**
 * Add a member to a working group (internal function)
 */
async function addMemberToWorkingGroup(
  groupId: ObjectId,
  user: AuthenticatedUser
) {
  const userId = new ObjectId(user.sub)

  // Check if user is already a member
  const existingMember = await collections.workingGroupMembers.findOne({
    groupId,
    userId,
  })

  if (existingMember) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'User is already a member of this group',
    })
  }

  const profileSnapshot: ProfileSnapshot = {
    name: user.name,
    email: user.email,
    githubUsername: user.connections.github?.username,
    discordName: user.connections.discord?.username,
    googleAccount: user.connections.google?.email,
    figmaEmail: user.connections.figma?.email,
  }
  
  // Add user as a member
  await collections.workingGroupMembers.insertOne({
    groupId,
    userId,
    joinedAt: new Date(),
    profileSnapshot,
  })
}

/**
 * Create a new working group
 */
export async function createWorkingGroup(name: string, user: AuthenticatedUser) {
  const normalizedName = name.toLowerCase()
  const userId = new ObjectId(user.sub)

  // Check if group already exists
  const existing = await collections.workingGroups.findOne({
    name: normalizedName,
  })
  if (existing) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'A working group with this name already exists',
    })
  }

  // Create a new working group
  const group: WorkingGroup = {
    name: normalizedName,
    createdAt: new Date(),
    createdBy: userId,
    admins: [userId],
    inviteKeys: [],
  }

  const result = await collections.workingGroups.insertOne(group)
  if (!result.acknowledged) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create working group',
    })
  }

  const newGroup = {
    ...group,
    _id: result.insertedId,
  }
  
  // Add the creator as the first member
  await addMemberToWorkingGroup(newGroup._id, user)

  return newGroup
}

/**
 * Check if a user is a member of a working group
 */
export async function isUserMemberOfGroup(groupId: ObjectId, userId: ObjectId) {
  const member = await collections.workingGroupMembers.findOne({
    groupId,
    userId,
  })
  return !!member
}

/**
 * Transform a WorkingGroupMember to its DTO representation
 */
function transformMemberToDTO(
  member: WithId<WorkingGroupMember>
): WorkingGroupMemberDTO {
  return {
    id: member._id.toString(),
    userId: member.userId.toString(),
    joinedAt: member.joinedAt.toISOString(),
    profileSnapshot: member.profileSnapshot,
  }
}

/**
 * Create an invite link for a working group
 * @param name Working group name
 * @param user Authenticated user creating the invite
 */
export async function createInviteLink(name: string, user: AuthenticatedUser) {
  // Get group with user's role information
  const groupData = await getWorkingGroupWithDetails(name, user)
  
  if (!groupData) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Working group not found',
    })
  }
  
  // Check if user is an admin
  if (!groupData.isCurrentUserAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only admins can create invite links',
    })
  }
  
  const groupId = new ObjectId(groupData.publicWorkingGroupInformation.id)
  const creatorId = new ObjectId(user.sub)

  // Generate a random invite key
  const key = crypto.randomBytes(16).toString('hex')

  // Add the invite key to the group
  const inviteKey = {
    key,
    enabled: true,
    createdAt: new Date(),
    createdBy: creatorId,
  }

  await collections.workingGroups.updateOne(
    { _id: groupId },
    { $push: { inviteKeys: inviteKey } }
  )

  return inviteKey
}

/**
 * Check if a user can join a working group with the given invite key
 * Returns detailed information about joinability status and requirements
 */
export async function checkJoinability(
  inviteKey: string,
  user: AuthenticatedUser
): Promise<JoinabilityResult> {
  // Find the group with the invite key
  const group = await collections.workingGroups.findOne({
    'inviteKeys.key': inviteKey,
    'inviteKeys.enabled': true,
  })

  if (!group) {
    return {
      canJoin: false,
      group: { id: '', name: '' },
      userIsAlreadyMember: false,
      requirements: [],
      profileSnapshot: {
        name: user.name,
        email: user.email,
      },
      errorMessage: 'Invalid or expired invite key',
    }
  }

  const userId = new ObjectId(user.sub)
  
  // Check if user is already a member
  const existingMember = await collections.workingGroupMembers.findOne({
    groupId: group._id,
    userId,
  })
  
  // Prepare the profile snapshot that would be saved
  const profileSnapshot: ProfileSnapshot = {
    name: user.name,
    email: user.email,
    githubUsername: user.connections.github?.username,
    discordName: user.connections.discord?.username,
    googleAccount: user.connections.google?.email,
    figmaEmail: user.connections.figma?.email,
  }

  // Check all connection requirements
  const requirements: JoinRequirement[] = REQUIRED_CONNECTIONS.map(connType => {
    const connection = user.connections[connType as keyof typeof user.connections]
    return {
      type: 'connection',
      name: connType,
      displayName: `${CONNECTION_DISPLAY_NAMES[connType] || connType} Account`,
      met: !!connection,
      ...(connection ? {} : {
        callToAction: {
          text: `Connect ${CONNECTION_DISPLAY_NAMES[connType] || connType}`,
          url: `/dashboard/profile#${connType}`,
        }
      })
    }
  })

  // Check if all requirements are met
  const unmetRequirements = requirements.filter(req => !req.met)
  const canJoin = unmetRequirements.length === 0 && !existingMember

  // Prepare the result
  const result: JoinabilityResult = {
    canJoin,
    group: {
      id: group._id.toString(),
      name: group.name,
    },
    userIsAlreadyMember: !!existingMember,
    requirements,
    profileSnapshot,
  }

  // Add specific error message if needed
  if (existingMember) {
    result.errorMessage = 'You are already a member of this group'
  } else if (unmetRequirements.length > 0) {
    result.errorMessage = `You need to fulfill all requirements before joining this group`
  }

  return result
}

/**
 * Join a working group using an invite key
 */
export async function joinWorkingGroup(
  inviteKey: string,
  user: AuthenticatedUser
) {
  // Check joinability first
  const joinabilityResult = await checkJoinability(inviteKey, user)
  
  // Handle errors
  if (!joinabilityResult.canJoin) {
    if (joinabilityResult.errorMessage) {
      throw new TRPCError({
        code: joinabilityResult.userIsAlreadyMember ? 'CONFLICT' : 'BAD_REQUEST',
        message: joinabilityResult.errorMessage,
      })
    } else {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Unable to join the working group',
      })
    }
  }

  // All checks passed, add the user as a member
  await collections.workingGroupMembers.insertOne({
    groupId: new ObjectId(joinabilityResult.group.id),
    userId: new ObjectId(user.sub),
    joinedAt: new Date(),
    profileSnapshot: joinabilityResult.profileSnapshot,
  })

  return joinabilityResult.group
}
