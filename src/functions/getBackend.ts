import { BACKEND_URL, JWT_PRIVATE_KEY } from 'astro:env/server'
import { createTRPCProxyClient, httpLink } from '@trpc/client'

import { type AppRouter, appRouter } from '$backend'
import { localLink } from './localLink'

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

export type Backend = ReturnType<typeof getBackend>

function createProxyClient(token: string | undefined) {
  return createTRPCProxyClient<AppRouter>({
    links: [
      JWT_PRIVATE_KEY?.replaceAll(/\\n/g, '\n')
        ? localLink(appRouter, { authToken: token })
        : httpLink({
            url: BACKEND_URL || 'https://creatorsgarten.org/api/backend',
            headers: token ? { authorization: `Bearer ${token}` } : {},
          }),
    ],
  })
}
