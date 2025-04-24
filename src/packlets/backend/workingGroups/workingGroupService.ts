import { TRPCError } from '@trpc/server'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

import { collections } from '$constants/mongo'

// Working group name schema for validation
export const workingGroupNameSchema = z
  .string()
  .min(3, 'Group name must be at least 3 characters')
  .max(30, 'Group name must be at most 30 characters')
  .regex(
    /^[a-z0-9-]+$/,
    'Group name must contain only lowercase letters, numbers, and hyphens'
  )

/**
 * Get a working group by name
 */
export async function getWorkingGroupByName(name: string) {
  return collections.workingGroups.findOne({ name: name.toLowerCase() })
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
  const group = {
    name: normalizedName,
    createdAt: new Date(),
    createdBy: userId,
    admins: [userId],
    inviteKeys: [],
    profileFields: ['name', 'email', 'githubUsername', 'discordName'],
    customQuestions: [],
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
  user: {
    sub: string
    name: string
    email: string
    connections: {
      github?: { login: string }
      discord?: { username: string }
      google?: { email: string }
      figma?: { email: string }
    }
  }
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

  // Add user as a member
  await collections.workingGroupMembers.insertOne({
    groupId,
    userId,
    joinedAt: new Date(),
    profileSnapshot: {
      name: user.name,
      email: user.email,
      githubUsername: user.connections.github?.login,
      discordName: user.connections.discord?.username,
      googleAccount: user.connections.google?.email,
      figmaEmail: user.connections.figma?.email,
    },
    questionResponses: [],
  })
}

/**
 * Check if a wiki page exists for a working group
 */
export async function checkWikiPageExists(name: string) {
  const pageRef = `WorkingGroups/${name.toLowerCase()}`

  // This is a placeholder - in a real implementation,
  // you would check if the wiki page exists
  // For now, we'll assume it exists for demonstrational purposes
  return { exists: true, pageRef }
}

/**
 * Get members of a working group
 */
export async function getWorkingGroupMembers(groupId: ObjectId) {
  // First get the working group to access admin list
  const group = await collections.workingGroups.findOne({ _id: groupId })
  if (!group) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Working group not found',
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
    members,
    counts: {
      admins: adminCount,
      members: memberCount,
      total: members.length,
    },
  }
}
