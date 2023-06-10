import { getBackend } from '$functions/getBackend'

import type { APIRoute } from 'astro'

export const get: APIRoute = async Astro => {
  const access = await getBackend(
    Astro
  ).g0.createAccessQrCode.mutate()

  // todo: plug with zero-trust to get card from backend, add fake delay for realism
  // await new Promise(r => setTimeout(r, 3000))
// 

  return {
    body: JSON.stringify(access),
  }
}
