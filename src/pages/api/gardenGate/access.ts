import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  return new Response(
    JSON.stringify(await locals.backend.gardenGate.createAccessQrCode.mutate()),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
