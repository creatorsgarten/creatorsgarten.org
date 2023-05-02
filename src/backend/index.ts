import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { authenticateEventpopUser } from './auth/authenticateEventpopUser'
import { authenticateGitHub } from './auth/authenticateGitHub'
import { getAuthenticatedUser } from './auth/getAuthenticatedUser'

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
  }),
})

export type AppRouter = typeof appRouter
