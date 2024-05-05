import { defineMiddleware } from 'astro/middleware'
import memoize from 'memoize'

export const userMiddleware = defineMiddleware(async ({ locals }, next) => {
  locals.user = await memoize(
    async () => locals.eden.auth.user.get().then(({ data }) => data),
    {
      maxAge: 1000 * 60 * 15, // 15 minutes
    }
  )()

  return next()
})
