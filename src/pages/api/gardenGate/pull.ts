import { getBackend } from '$functions/getBackend'

import type { APIRoute } from 'astro'

export const get: APIRoute = async ctx => {
  await getBackend(ctx).g0.pullLogs.query()

  return {
    body: 'ok'
  }
}
