import { CONTENT_API_URL } from 'astro:env/server'
import { createTRPCProxyClient, httpLink } from '@trpc/client'
import type { ContentsgartenRouter } from 'contentsgarten'

export const contentsgarten = (authorizationToken?: string) =>
  createTRPCProxyClient<ContentsgartenRouter>({
    links: [
      httpLink({
        url: `${CONTENT_API_URL}/api/contentsgarten`,
        headers: authorizationToken
          ? {
              Authorization: `Bearer ${authorizationToken}`,
            }
          : undefined,
      }),
    ],
  })
