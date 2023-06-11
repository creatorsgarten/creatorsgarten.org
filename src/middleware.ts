import { defineMiddleware } from 'astro/middleware'

import { getBackend } from '$functions/getBackend'

export const onRequest = defineMiddleware(async (ctx, next) => {
  const authenticatedUser = await getBackend(
    ctx
  ).auth.getAuthenticatedUser.query()

  ctx.locals.user = authenticatedUser

  next()
})
