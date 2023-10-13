import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  return {
    body: JSON.stringify(
      await locals.backend.gardenGate.createAccessQrCode.mutate()
    ),
  }
}
