import { createTRPCProxyClient, httpLink } from '@trpc/client'

import { contentApiBaseUrl } from './contentApiBaseUrl'

import type { ContentsgartenRouter } from 'contentsgarten'

export const contentsgarten = (authorizationToken?: string) =>
  createTRPCProxyClient<ContentsgartenRouter>({
    links: [
      httpLink({
        url: `${contentApiBaseUrl}/api/contentsgarten`,
        headers: authorizationToken
          ? {
              Authorization: `Bearer ${authorizationToken}`,
            }
          : undefined,
      }),
    ],
  })
