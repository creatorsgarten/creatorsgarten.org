import { TRPCError, initTRPC } from '@trpc/server'
import { z } from 'zod'

interface BackendContext {
  authToken?: string
}

const t = initTRPC.context<BackendContext>().create()

export const appRouter = t.router({
  about: t.procedure.query(() => 'creatorsgarten.org'),
  auth: t.router({
    signInWithEventpopAuthorizationCode: t.procedure
      .input(
        z.object({
          code: z.string(),
        })
      )
      .mutation(({ input }) => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'not implemented',
        })
      }),
  }),
})

export type AppRouter = typeof appRouter
