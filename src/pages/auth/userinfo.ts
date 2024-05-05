import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  const { data: authenticatedUser } = await locals.eden.auth.user.get()
  return new Response(JSON.stringify(authenticatedUser), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
