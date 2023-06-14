import { createTRPCProxyClient, httpLink } from '@trpc/client'

import { AppRouter, appRouter } from 'src/backend'
import { localLink } from './localLink'

import { privateKey } from '$constants/secrets/privateKey'
import { backendUrl } from '$constants/secrets/backendUrl'

import type { AstroGlobal } from 'astro'

export function getBackend(Astro: Pick<AstroGlobal, 'cookies'>) {
  const token = Astro.cookies.get('authgarten').value

  return createTRPCProxyClient<AppRouter>({
    links: [
      privateKey
        ? localLink(appRouter, { authToken: token })
        : httpLink({
            url: backendUrl || 'https://creatorsgarten.org/api/backend',
            headers: token ? { authorization: `Bearer ${token}` } : {},
          }),
    ],
  })
}
