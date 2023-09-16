import { defineMiddleware } from 'astro/middleware'
import mem from 'mem'

export const userMiddleware = defineMiddleware(async ({ locals }, next) => {
  locals.user = await mem(
    () => locals.backend.auth.getAuthenticatedUser.query(),
    {
      maxAge: 1000 * 60 * 15, // 15 minutes
    }
  )()

  return next()
})
