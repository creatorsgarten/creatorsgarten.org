import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  return new Response(
    JSON.stringify(await locals.eden.gardenGate.access.post()),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
