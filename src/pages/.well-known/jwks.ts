import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  const body = JSON.stringify({
    keys: await locals.backend.auth.getPublicKeys.query(),
  })
  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
