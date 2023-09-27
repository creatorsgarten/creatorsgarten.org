import type { APIRoute } from 'astro'

export const get: APIRoute = async ({ locals }) => {
  await locals.backend.gardenGate.pullLogs.query()

  return {
    body: 'ok',
  }
}
