import { edenTreaty } from '@elysiajs/eden'
import { defineMiddleware } from 'astro/middleware'

import type { Backend } from '../../backend'
import { backendUrl } from '$constants/secrets/backendUrl.ts'

export const eden = (headers: Headers) =>
  edenTreaty<Backend>(
    // backendUrl || 'https://creatorsgarten.org',
    'http://localhost:3000',
    {
      $fetch: {
        headers: headers,
      },
      fetcher: (input, init) => {
        return fetch(input, init)
      },
    }
  )

export type Eden = ReturnType<typeof eden>

export const backendMiddleware = defineMiddleware(
  async ({ locals, request }, next) => {
    locals.eden = eden(request.headers).api.backend

    return next()
  }
)
