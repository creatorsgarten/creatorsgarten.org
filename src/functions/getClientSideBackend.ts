import { createTRPCProxyClient, httpLink } from '@trpc/client'
import type { AppRouter } from 'src/backend'

export function getClientSideBackend() {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpLink({
        url: '/api/backend',
        headers: token ? { authorization: `Bearer ${token}` } : {},
      }),
    ],
  })
}
