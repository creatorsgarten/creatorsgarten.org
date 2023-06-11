import { getBackend } from '$functions/getBackend'

import type { APIRoute } from 'astro'

export const get: APIRoute = async ctx => {
  return {
    body: JSON.stringify(await getBackend(ctx).g0.createAccessQrCode.mutate()),
  }
}
