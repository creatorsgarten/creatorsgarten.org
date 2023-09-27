import type { APIRoute } from 'astro'

export const get: APIRoute = async ({ locals }) => {
  return {
    body: JSON.stringify(
      await locals.backend.gardenGate.createAccessQrCode.mutate()
    ),
  }
}
