import { createTRPCProxyClient, httpLink } from '@trpc/client'

import { contentApiBaseUrl } from './contentApiBaseUrl'

import type { ContentsgartenRouter } from 'contentsgarten'

export const contentsgarten = createTRPCProxyClient<ContentsgartenRouter>({
  links: [
    httpLink({
      url: `${contentApiBaseUrl}/api/contentsgarten`,
    }),
  ],
})
