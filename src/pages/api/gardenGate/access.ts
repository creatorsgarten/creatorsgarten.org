import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  const { data } = await locals.backend.gardenGate.createAccessQrCode.post()
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
