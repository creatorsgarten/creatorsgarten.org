import { createTRPCProxyClient, httpLink } from '@trpc/client'
import type { AnyRouter, inferRouterContext } from '@trpc/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import type { AstroGlobal } from 'astro'
import { getAuthTokenFromAstro } from './auth/getAuthTokenFromAstro'
import { AppRouter, appRouter } from 'src/backend'

function localLink<TRouter extends AnyRouter>(
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

export function getBackend(Astro: Pick<AstroGlobal, 'cookies'>) {
  const token = getAuthTokenFromAstro(Astro)
  return createTRPCProxyClient<AppRouter>({
    links: [
      import.meta.env.JWT_PRIVATE_KEY
        ? localLink(appRouter, { authToken: token })
        : httpLink({
            url:
              import.meta.env.BACKEND_URL ||
              'https://new.creatorsgarten.org/api/backend',
            headers: token ? { authorization: `Bearer ${token}` } : {},
          }),
    ],
  })
}
