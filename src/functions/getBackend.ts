import { treaty } from '@elysiajs/eden'
import { BACKEND_URL, JWT_PRIVATE_KEY } from 'astro:env/server'

import { app, type App } from '$backend'

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

// Eden's error union always includes Elysia's own validation-error shape
// (`{ type: 'validation', message, ... }`) alongside whatever the route
// itself returned via `status(code, { error })` -- this pulls a readable
// message out of either shape.
export function backendErrorMessage(
  error: { value: unknown } | null | undefined,
  fallback: string
): string {
  const value = error?.value
  if (value && typeof value === 'object') {
    if ('error' in value && typeof value.error === 'string') return value.error
    if ('message' in value && typeof value.message === 'string')
      return value.message
  }
  return fallback
}

function createProxyClient(token: string | undefined) {
  const headers = token ? { authorization: `Bearer ${token}` } : {}
  return JWT_PRIVATE_KEY?.replaceAll(/\\n/g, '\n')
    ? treaty<App>(app, { headers })
    : treaty<App>(BACKEND_URL || 'https://creatorsgarten.org/api/backend', {
        headers,
      })
}
