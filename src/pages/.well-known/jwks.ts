import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  const { data: keys } = await locals.backend.auth.getPublicKeys.get()
  const body = JSON.stringify({ keys })
  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
