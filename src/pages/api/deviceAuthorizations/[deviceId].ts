import type { APIRoute } from 'astro'

export const GET: APIRoute = async Astro => {
  const deviceId = String(Astro.params.deviceId)
  const result =
    await Astro.locals.backend.deviceAuthorizations.getDeviceAuthorization.query(
      {
        deviceId,
      }
    )
  return new Response(JSON.stringify(result), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
