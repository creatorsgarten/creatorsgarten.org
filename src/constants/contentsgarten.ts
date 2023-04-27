import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

import { contentApiBaseUrl } from './contentApiBaseUrl'

import type { ContentsgartenRouter } from 'contentsgarten'

export const contentsgarten = createTRPCProxyClient<ContentsgartenRouter>({
  links: [
    httpBatchLink({
      url: `${contentApiBaseUrl}/contentsgarten`,
    }),
  ],
})
