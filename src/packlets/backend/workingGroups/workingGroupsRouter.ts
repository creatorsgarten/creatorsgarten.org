import { TRPCError } from '@trpc/server'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

import { getAuthenticatedUser } from '../auth/getAuthenticatedUser'
import {
  addMemberToWorkingGroup,
  checkWikiPageExists,
  createWorkingGroup,
  getWorkingGroupByName,
  getWorkingGroupMembers,
  workingGroupNameSchema,
} from './workingGroupService'

export function createWorkingGroupsRouter(t: any) {
  return t.router({
    // Get a working group by its name
    getByName: t.procedure
      .input(
        z.object({
          name: workingGroupNameSchema,
        })
      )
      .query(async ({ input }) => {
        return getWorkingGroupByName(input.name)
      }),

    // Create a new working group
    create: t.procedure
      .input(
        z.object({
          name: workingGroupNameSchema,
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await getAuthenticatedUser(ctx.authToken)
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to create a working group',
          })
        }

        // Create the working group
        const userId = new ObjectId(user.sub)
        const group = await createWorkingGroup(input.name, userId)

        // Add the creator as the first member
        await addMemberToWorkingGroup(group._id, user)

        return group
      }),

    // Check if a wiki page exists for a working group
    checkWikiPageExists: t.procedure
      .input(
        z.object({
          name: workingGroupNameSchema,
        })
      )
      .query(async ({ input }) => {
        return checkWikiPageExists(input.name)
      }),

    // Get members of a working group
    getMembers: t.procedure
      .input(
        z.object({
          groupId: z.string(),
        })
      )
      .query(async ({ input }) => {
        // Convert string ID to ObjectId
        const groupId = new ObjectId(input.groupId)
        return getWorkingGroupMembers(groupId)
      }),
  })
}
