import { getApiBackend } from '$functions/getBackend'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async Astro => {
  const authenticatedUser =
    await getApiBackend(Astro).auth.getAuthenticatedUser.query()
  return new Response(JSON.stringify(authenticatedUser), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
