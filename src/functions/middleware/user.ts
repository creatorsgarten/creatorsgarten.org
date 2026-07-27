import { defineMiddleware } from 'astro/middleware'
import memoize from 'memoize'

export const userMiddleware = defineMiddleware(async ({ locals }, next) => {
  locals.user = await memoize(
    async () => {
      const { data } = await locals.backend.auth.getAuthenticatedUser.get()
      return data ?? null
    },
    {
      maxAge: 1000 * 60 * 15, // 15 minutes
    }
  )()

  return next()
})
