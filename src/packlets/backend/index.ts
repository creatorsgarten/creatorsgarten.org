import { TRPCError, initTRPC } from '@trpc/server'
import { createPrivateKey, createPublicKey } from 'crypto'
import { exportJWK } from 'jose'
import { z } from 'zod'

import { JWT_PRIVATE_KEY } from 'astro:env/server'

import { authenticateDiscord } from './auth/authenticateDiscord'
import { authenticateEventpopUser } from './auth/authenticateEventpopUser'
import { authenticateGitHub } from './auth/authenticateGitHub'
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

    getPublicKeys: t.procedure.query(async () => {
      const privateKeyObj = createPrivateKey(JWT_PRIVATE_KEY)
      const publicKeyObj = createPublicKey(privateKeyObj)
      return [{ ...(await exportJWK(publicKeyObj)), kid: 'riffy1' }]
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
})

export type AppRouter = typeof appRouter
