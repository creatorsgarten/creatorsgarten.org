import { httpLink } from '@trpc/client'
import type { AnyRouter, inferRouterContext } from '@trpc/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

export function localLink<TRouter extends AnyRouter>(
  router: TRouter,
  context: inferRouterContext<TRouter>
) {
  return httpLink({
    url: 'http://local',
    fetch: async (...args) => {
      const request = new Request(...args)
      return fetchRequestHandler({
        endpoint: '',
        req: request,
        router,
        createContext: () => context,
      })
    },
  })
}
