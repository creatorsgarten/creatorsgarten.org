import { defineMiddleware } from 'astro/middleware'

export const userMiddleware = defineMiddleware(async ({ locals }, next) => {
  locals.user = await locals.backend.auth.getAuthenticatedUser.query()

  return next()
})
