import { getBackend } from '$functions/getBackend'
import { defineMiddleware } from 'astro/middleware'

export const backendMiddleware = defineMiddleware(
  async ({ locals, cookies }, next) => {
    locals.backend = getBackend(cookies)

    return next()
  }
)
