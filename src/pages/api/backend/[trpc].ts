import { initTRPC } from '@trpc/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import type { APIRoute } from 'astro'

interface BackendContext {
  authToken?: string
}

const t = initTRPC.context<BackendContext>().create()

const appRouter = t.router({
  about: t.procedure.query(() => 'creatorsgarten.org'),
})

export const all: APIRoute = opts => {
  return fetchRequestHandler({
    endpoint: '/api/backend',
    req: opts.request,
    router: appRouter,
    createContext: ({ req }) => ({
      authToken: req.headers.get('authorization')
        ? req.headers.get('authorization')?.split(' ')[1]
        : undefined,
    }),
  })
}
