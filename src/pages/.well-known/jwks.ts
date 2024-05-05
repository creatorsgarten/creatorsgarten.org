import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  const body = JSON.stringify({
    keys: await locals.eden.auth.publicKeys.get().then(o => o.data),
  })
  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
