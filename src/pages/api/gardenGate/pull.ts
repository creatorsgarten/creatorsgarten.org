import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  await locals.backend.gardenGate.pullLogs.query()

  return {
    body: 'ok',
  }
}
