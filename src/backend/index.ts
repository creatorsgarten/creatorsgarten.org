import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authenticateEventpopUser } from './auth/authenticateEventpopUser'
import { authenticateGitHub } from './auth/authenticateGitHub'
import { getAuthenticatedUser } from './auth/getAuthenticatedUser'
import { privateKey } from '$constants/secrets/privateKey'
import { createPrivateKey, createPublicKey } from 'crypto'
import { exportJWK } from 'jose'
import { checkAccess, createAccessQrCode } from './g0'

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

    signInWithEventpopAuthorizationCode: t.procedure
      .input(
        z.object({
          code: z.string(),
        })
      )
      .mutation(({ input }) => {
        return authenticateEventpopUser(input.code)
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

    getPublicKeys: t.procedure.query(async () => {
      const privateKeyObj = createPrivateKey(privateKey)
      const publicKeyObj = createPublicKey(privateKeyObj)
      return [{ ...(await exportJWK(publicKeyObj)), kid: 'riffy1' }]
    }),
  }),

  g0: t.router({
    createAccessQrCode: t.procedure.mutation(async ({ ctx }) => {
      const user = await getAuthenticatedUser(ctx.authToken)
      return createAccessQrCode(user)
    }),
    checkAccess: t.procedure.query(async ({ ctx }) => {
      const user = await getAuthenticatedUser(ctx.authToken)
      return checkAccess(user)
    }),
  }),
})

export type AppRouter = typeof appRouter
