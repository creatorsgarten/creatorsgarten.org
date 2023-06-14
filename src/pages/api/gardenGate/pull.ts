import { getBackend } from '$functions/getBackend'

import type { APIRoute } from 'astro'

export const get: APIRoute = async ctx => {
  await getBackend(ctx).gardenGate.pullLogs.query()

  return {
    body: 'ok'
  }
}
