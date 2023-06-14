import { createTRPCProxyClient, httpLink } from '@trpc/client'
import type { AstroGlobal } from 'astro'
import { getAuthTokenFromAstro } from './auth/getAuthTokenFromAstro'
import { AppRouter, appRouter } from 'src/backend'
import { localLink } from './localLink'
import { privateKey } from '$constants/secrets/privateKey'

export function getBackend(Astro: Pick<AstroGlobal, 'cookies'>) {
  const token = getAuthTokenFromAstro(Astro)

  return createTRPCProxyClient<AppRouter>({
    links: [
      privateKey
        ? localLink(appRouter, { authToken: token })
        : httpLink({
            url:
              import.meta.env.BACKEND_URL ||
              'https://creatorsgarten.org/api/backend',
            headers: token ? { authorization: `Bearer ${token}` } : {},
          }),
    ],
  })
}
