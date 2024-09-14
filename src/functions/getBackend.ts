import { createTRPCProxyClient, httpLink } from '@trpc/client'

import { type AppRouter, appRouter } from '$backend'
import { localLink } from './localLink'

import { privateKey } from '$constants/secrets/privateKey'
import { backendUrl } from '$constants/secrets/backendUrl'

import type { AstroGlobal } from 'astro'

export function getBackend(cookies: AstroGlobal['cookies']) {
  const token = cookies.get('authgarten')?.value
  return createProxyClient(token)
}

export function getApiBackend(Astro: Pick<AstroGlobal, 'request'>) {
  const token = Astro.request.headers
    .get('authorization')
    ?.replace(/^Bearer /, '')
  return createProxyClient(token)
}

function createProxyClient(token: string | undefined) {
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
