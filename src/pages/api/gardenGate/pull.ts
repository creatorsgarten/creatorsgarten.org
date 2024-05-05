import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  await locals.eden.gardenGate.logs.get()

  return new Response('ok')
}
