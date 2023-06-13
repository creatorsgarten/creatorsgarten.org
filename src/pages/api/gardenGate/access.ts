import { getBackend } from '$functions/getBackend'

import type { APIRoute } from 'astro'

export const get: APIRoute = async Astro => {
  return {
    body: JSON.stringify(
      await getBackend(Astro).g0.createAccessQrCode.mutate()
    ),
  }
}
