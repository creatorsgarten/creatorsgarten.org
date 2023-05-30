import type { APIRoute } from 'astro'
import { getBackend } from '$functions/getBackend'

export const get: APIRoute = async Astro => {
  const backend = getBackend(Astro)

  return {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      keys: await backend.auth.getPublicKeys.query(),
    }),
  }
}
