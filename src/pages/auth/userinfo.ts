import { getApiBackend } from '$functions/getBackend'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async Astro => {
  const { data: authenticatedUser } =
    await getApiBackend(Astro).auth.getAuthenticatedUser.get()
  return new Response(JSON.stringify(authenticatedUser), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
