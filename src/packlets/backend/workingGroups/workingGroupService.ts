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

// API representation types - explicitly defining what we expose through the API
interface WorkingGroupPublicDTO {
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

interface WorkingGroupMemberViewDTO extends WorkingGroupPublicDTO {
  isCurrentUserAdmin: boolean
  admins: string[]
  inviteKeys?: Array<{
    key: string
    enabled: boolean
    createdAt: string
    createdBy: string
  }>
}

interface WorkingGroupInviteViewDTO {
  id: string
  name: string
  createdAt: string
}

/**
 * Get a working group by name - PUBLIC VERSION
 * Only returns non-sensitive information
 */
export async function getWorkingGroupByNamePublic(
  name: string
): Promise<WorkingGroupPublicDTO | null> {
  const group = await collections.workingGroups.findOne({
    name: name.toLowerCase(),
  })

  if (!group) return null

  // Calculate member counts
  const members = await collections.workingGroupMembers
    .find({ groupId: group._id })
    .toArray()

  const adminCount = group.admins.length
  const memberCount = members.length - adminCount

  // Return only public information in a well-defined format
  return {
    id: group._id.toString(),
    name: group.name,
    createdAt: group.createdAt.toISOString(),
    memberCounts: {
      admins: adminCount,
      members: memberCount,
      total: members.length,
    },
  }
}

/**
 * Get a working group by name with details appropriate for the user's role
 */
export async function getWorkingGroupForUser(
  name: string,
  userId: ObjectId
): Promise<WorkingGroupMemberViewDTO | null> {
  const group = await collections.workingGroups.findOne({
    name: name.toLowerCase(),
  })

  if (!group) return null

  // Check if user is a member
  const isMember = await isUserMemberOfGroup(group._id, userId)
  const isAdmin = group.admins.some(adminId => adminId.equals(userId))

  if (!isMember && !isAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be a member to access this information',
    })
  }

  // Base member view that both members and admins get
  const memberView: WorkingGroupMemberViewDTO = {
    id: group._id.toString(),
    name: group.name,
    createdAt: group.createdAt.toISOString(),
    memberCounts: await getMemberCounts(group._id),
    isCurrentUserAdmin: isAdmin,
    admins: group.admins.map(id => id.toString()),
  }

  // If admin, return additional admin information
  if (isAdmin) {
    return {
      ...memberView,
      inviteKeys: group.inviteKeys.map(key => ({
        key: key.key,
        enabled: key.enabled,
        createdAt: key.createdAt.toISOString(),
        createdBy: key.createdBy.toString(),
      })),
    }
  }

  // For regular members, return just the member view
  return memberView
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
 * Create a new working group
 */
export async function createWorkingGroup(name: string, userId: ObjectId) {
  const normalizedName = name.toLowerCase()

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

  return {
    ...group,
    _id: result.insertedId,
  }
}

/**
 * Add a member to a working group
 */
export async function addMemberToWorkingGroup(
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
 * Get members of a working group (authorized users only)
 */
export async function getWorkingGroupMembers(
  groupId: ObjectId,
  requesterId: ObjectId
): Promise<{
  members: WorkingGroupMemberDTO[]
  counts: {
    admins: number
    members: number
    total: number
  }
}> {
  // First get the working group to access admin list
  const group = await collections.workingGroups.findOne({ _id: groupId })
  if (!group) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Working group not found',
    })
  }

  // Check if requester is a member or admin
  const isMember = await isUserMemberOfGroup(groupId, requesterId)
  const isAdmin = group.admins.some(adminId => adminId.equals(requesterId))

  if (!isMember && !isAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be a member to view the member list',
    })
  }

  // Get all members of the group
  const members = await collections.workingGroupMembers
    .find({ groupId })
    .toArray()

  // Count admins and regular members based on the group's admin list
  const adminCount = group.admins.length
  const memberCount = members.length - adminCount

  return {
    members: members.map(transformMemberToDTO),
    counts: {
      admins: adminCount,
      members: memberCount,
      total: members.length,
    },
  }
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
 */
export async function createInviteLink(groupId: ObjectId, creatorId: ObjectId) {
  // Check if group exists
  const group = await collections.workingGroups.findOne({ _id: groupId })
  if (!group) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Working group not found',
    })
  }

  // Check if user is an admin
  if (!group.admins.some(adminId => adminId.equals(creatorId))) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only admins can create invite links',
    })
  }

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
 * Get a working group by invite key (for joining)
 * Only returns minimal information needed for joining
 */
export async function getWorkingGroupByInviteKey(
  inviteKey: string
): Promise<WorkingGroupInviteViewDTO> {
  const group = await collections.workingGroups.findOne({
    'inviteKeys.key': inviteKey,
    'inviteKeys.enabled': true,
  })

  if (!group) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Invalid or expired invite key',
    })
  }

  // Return only necessary information for joining
  return {
    id: group._id.toString(),
    name: group.name,
    createdAt: group.createdAt.toISOString(),
  }
}

/**
 * Join a working group using an invite key
 */
export async function joinWorkingGroup(
  inviteKey: string,
  user: AuthenticatedUser
) {
  // Check if the user has all the required connections
  for (const connection of REQUIRED_CONNECTIONS) {
    if (!user.connections[connection as keyof typeof user.connections]) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `You must connect your ${connection} account before joining a working group`,
      })
    }
  }

  const group = await getWorkingGroupByInviteKey(inviteKey)
  const userId = new ObjectId(user.sub)

  // Check if user is already a member
  const existingMember = await collections.workingGroupMembers.findOne({
    groupId: new ObjectId(group.id),
    userId,
  })

  if (existingMember) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'You are already a member of this group',
    })
  }

  // Create the profile snapshot with required fields
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
    groupId: new ObjectId(group.id),
    userId,
    joinedAt: new Date(),
    profileSnapshot,
  })

  return group
}
