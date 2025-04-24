import { TRPCError, initTRPC } from '@trpc/server'
import { createPrivateKey, createPublicKey } from 'crypto'
import { exportJWK } from 'jose'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

import { collections } from '$constants/mongo'
import {
  reservedUsernames,
  usernameSchema,
} from '$functions/usernameValidation'
import { JWT_PRIVATE_KEY } from 'astro:env/server'
import { finalizeAuthentication } from './auth/finalizeAuthentication'

import { authenticateDiscord } from './auth/authenticateDiscord'
import { authenticateEventpopUser } from './auth/authenticateEventpopUser'
import { authenticateFigma } from './auth/authenticateFigma'
import { authenticateGitHub } from './auth/authenticateGitHub'
import { authenticateGoogle } from './auth/authenticateGoogle'
import { getAuthenticatedUser } from './auth/getAuthenticatedUser'

import { authenticateDeviceAuthorizationSignature } from './auth/authenticateDeviceAuthorizationSignature'
import { mintIdToken } from './auth/mintIdToken'
import {
  auditInputSchema,
  checkOAuthAudit,
  recordOAuthAudit,
} from './auth/oAuthAudit'
import { getDeviceAuthorization } from './deviceAuthorizations/getDeviceAuthorization'
import { saveDeviceAuthorization } from './deviceAuthorizations/saveDeviceAuthorization'
import { getJoinedEvents } from './events/getJoinedEvents'
import { checkAccess } from './gardenGate/checkAccess'
import { createAccessQrCode } from './gardenGate/createAccessQrCode'
import { pullLogs } from './gardenGate/pullLogs'
import { generateSignature } from './signatures/generateSignature'
import { verifySignature } from './signatures/verifySignature'
import { generateCloudinarySignature } from './uploads/generateCloudinarySignature'
import {
  REQUIRED_CONNECTIONS,
  addMemberToWorkingGroup,
  createInviteLink,
  createWorkingGroup,
  getWorkingGroupByInviteKey,
  getWorkingGroupWithDetails,
  joinWorkingGroup,
  workingGroupNameSchema,
} from './workingGroups/workingGroupService'

interface BackendContext {
  authToken?: string
}

const t = initTRPC.context<BackendContext>().create()

export const appRouter = t.router({
  about: t.procedure.query(() => 'creatorsgarten.org'),

  auth: t.router({
    getAuthenticatedUser: t.procedure.query(({ ctx }) => {
      return getAuthenticatedUser(ctx.authToken)
    }),

    checkOAuthAudit: t.procedure
      .input(auditInputSchema)
      .query(async ({ ctx, input }) => checkOAuthAudit(ctx.authToken, input)),

    recordOAuthAudit: t.procedure
      .input(auditInputSchema)
      .mutation(async ({ ctx, input }) =>
        recordOAuthAudit(ctx.authToken, input)
      ),

    mintIdToken: t.procedure
      .input(
        z.object({
          audience: z.string(),
          nonce: z.string().optional(),
          scopes: z.array(z.string()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await getAuthenticatedUser(ctx.authToken)
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User is not authenticated',
          })
        }
        return mintIdToken(user, input.audience, input.nonce, input.scopes)
      }),

    signInWithEventpopAuthorizationCode: t.procedure
      .input(
        z.object({
          code: z.string(),
        })
      )
      .mutation(({ input }) => {
        return authenticateEventpopUser(input.code)
      }),

    signInWithDeviceAuthorizationSignature: t.procedure
      .input(
        z.object({
          deviceId: z.string(),
          signature: z.string(),
        })
      )
      .mutation(({ input }) => {
        return authenticateDeviceAuthorizationSignature(
          input.deviceId,
          input.signature
        )
      }),

    linkGitHubAccount: t.procedure
      .input(
        z.object({
          code: z.string(),
        })
      )
      .mutation(({ input, ctx }) => {
        return authenticateGitHub(input.code, ctx.authToken)
      }),

    linkDiscordAccount: t.procedure
      .input(
        z.object({
          code: z.string(),
        })
      )
      .mutation(({ input, ctx }) => {
        return authenticateDiscord(input.code, ctx.authToken)
      }),

    linkGoogleAccount: t.procedure
      .input(
        z.object({
          code: z.string(),
        })
      )
      .mutation(({ input, ctx }) => {
        return authenticateGoogle(input.code, ctx.authToken)
      }),

    linkFigmaAccount: t.procedure
      .input(
        z.object({
          code: z.string(),
        })
      )
      .mutation(({ input, ctx }) => {
        return authenticateFigma(input.code, ctx.authToken)
      }),

    getPublicKeys: t.procedure.query(async () => {
      const privateKeyObj = createPrivateKey(
        JWT_PRIVATE_KEY.replaceAll(/\\n/g, '\n')
      )
      const publicKeyObj = createPublicKey(privateKeyObj)
      return [{ ...(await exportJWK(publicKeyObj)), kid: 'riffy1' }]
    }),

    checkUsernameAvailability: t.procedure
      .input(
        z.object({
          username: usernameSchema,
        })
      )
      .query(async ({ input }) => {
        const { username } = input

        // Check if username is in reserved list
        if (reservedUsernames.includes(username.toLowerCase())) {
          return { available: false, message: 'This username is reserved' }
        }

        // Check if username already exists in database
        const existingUser = await collections.users.findOne({
          username: username.toLowerCase(),
        })

        if (existingUser) {
          return { available: false, message: 'This username is already taken' }
        }

        return { available: true }
      }),

    reserveUsername: t.procedure
      .input(
        z.object({
          username: usernameSchema,
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await getAuthenticatedUser(ctx.authToken)
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to reserve a username',
          })
        }

        // Verify user has GitHub connection
        if (!user.connections.github) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message:
              'You must connect your GitHub account before reserving a username',
          })
        }

        const { username } = input
        const lowercaseUsername = username.toLowerCase()

        // Check if username is in reserved list
        if (reservedUsernames.includes(lowercaseUsername)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'This username is reserved',
          })
        }

        // Check if username already exists in database
        const existingUser = await collections.users.findOne({
          username: lowercaseUsername,
        })

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'This username is already taken',
          })
        }

        // Update user document with the new username
        const result = await collections.users.updateOne(
          { _id: new ObjectId(user.sub) },
          { $set: { username: lowercaseUsername } }
        )

        if (result.modifiedCount === 0) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update username',
          })
        }

        // Return updated user with new username
        return finalizeAuthentication(user.uid)
      }),
  }),

  events: t.router({
    getJoinedEvents: t.procedure.query(async ({ ctx }) => {
      const user = await getAuthenticatedUser(ctx.authToken)
      return getJoinedEvents(user)
    }),
  }),

  signatures: t.router({
    createSignature: t.procedure
      .input(
        z.object({
          message: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await getAuthenticatedUser(ctx.authToken)
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User is not authenticated',
          })
        }
        return generateSignature(user, input.message)
      }),

    verifySignature: t.procedure
      .input(
        z.object({
          signature: z.string(),
        })
      )
      .query(async ({ input }) => {
        return verifySignature(input.signature)
      }),
  }),

  uploads: t.router({
    getCloudinaryParameters: t.procedure.query(async ({ ctx }) => {
      const user = await getAuthenticatedUser(ctx.authToken)
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User is not authenticated',
        })
      }
      const params = {
        public_id_prefix: user.sub,
        asset_folder: user.sub,
        use_filename: 'true',
        use_filename_as_display_name: 'true',
        overwrite: 'false',
        metadata: `owner=${user.sub}`,
        colors: 'true',
        faces: 'true',
        quality_analysis: 'true',
        media_metadata: 'true',
        phash: 'true',
        detection: 'captioning',
        allowed_formats: 'webp,png,svg',
      }
      const cloudName = 'creatorsgarten'
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      const apiKey = '537643412116516'
      const formData = generateCloudinarySignature(params, {
        cloudName,
        apiKey,
        apiSecret: process.env.CLOUDINARY_API_SECRET!,
      })
      return { url, formData }
    }),
  }),

  deviceAuthorizations: t.router({
    saveDeviceAuthorization: t.procedure
      .input(
        z.object({
          deviceId: z.string(),
          signature: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await getAuthenticatedUser(ctx.authToken)
        return saveDeviceAuthorization(user, input.deviceId, input.signature)
      }),
    getDeviceAuthorization: t.procedure
      .input(
        z.object({
          deviceIdBasis: z.string(),
        })
      )
      .query(async ({ input }) => {
        return getDeviceAuthorization(input.deviceIdBasis)
      }),
  }),

  gardenGate: t.router({
    createAccessQrCode: t.procedure.mutation(async ({ ctx }) => {
      const user = await getAuthenticatedUser(ctx.authToken)
      return createAccessQrCode(user)
    }),
    checkAccess: t.procedure.query(async ({ ctx }) => {
      const user = await getAuthenticatedUser(ctx.authToken)
      return checkAccess(user)
    }),
    pullLogs: t.procedure.query(async ({ ctx }) => {
      await getAuthenticatedUser(ctx.authToken)
      return pullLogs()
    }),
  }),

  workingGroups: t.router({
    // Get a working group by its name with details appropriate for the user's role
    getWorkingGroup: t.procedure
      .input(z.object({ name: workingGroupNameSchema }))
      .query(async ({ ctx, input }) => {
        // If user is authenticated, get working group with user-specific details
        const user = await getAuthenticatedUser(ctx.authToken)
        
        return getWorkingGroupWithDetails(input.name, user)
      }),

    // Create a new working group
    create: t.procedure
      .input(z.object({ name: workingGroupNameSchema }))
      .mutation(async ({ ctx, input }) => {
        const user = await getAuthenticatedUser(ctx.authToken)
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to create a working group',
          })
        }

        // Create the working group
        const group = await createWorkingGroup(input.name, user)

        // Add the creator as the first member
        await addMemberToWorkingGroup(group._id, user)

        // Return the group with role-based details
        return getWorkingGroupWithDetails(input.name, user)
      }),

    // Get invite keys for a working group (admin only)
    getInviteKeys: t.procedure
      .input(
        z.object({
          name: workingGroupNameSchema,
        })
      )
      .query(async ({ ctx, input }) => {
        const user = await getAuthenticatedUser(ctx.authToken)
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to view invite keys',
          })
        }

        const groupData = await getWorkingGroupWithDetails(input.name, user)
        
        if (!groupData || !groupData.isCurrentUserAdmin) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You must be an admin to view invite keys',
          })
        }
        
        return groupData.inviteKeys || []
      }),

    // Create an invite link for a working group (admins only)
    createInviteLink: t.procedure
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
            message: 'You must be logged in to create an invite link',
          })
        }
        
        const result = await createInviteLink(input.name, user)

        // Return a safe representation with ISO string date
        return {
          key: result.key,
          enabled: result.enabled,
          createdAt: result.createdAt.toISOString(),
        }
      }),

    // Get a working group by invite key (safe version - for joining)
    getByInviteKey: t.procedure
      .input(
        z.object({
          inviteKey: z.string(),
        })
      )
      .query(async ({ input }) => {
        return getWorkingGroupByInviteKey(input.inviteKey)
      }),

    // Join a working group using an invite key
    joinWithInviteKey: t.procedure
      .input(
        z.object({
          inviteKey: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await getAuthenticatedUser(ctx.authToken)
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to join a working group',
          })
        }
        return joinWorkingGroup(input.inviteKey, user)
      }),

    // Get list of required connections for joining working groups
    getRequiredConnections: t.procedure.query(() => {
      return REQUIRED_CONNECTIONS
    }),
  }),
})

export type AppRouter = typeof appRouter
