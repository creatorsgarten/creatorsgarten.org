import type { APIRoute } from 'astro'

export const GET: APIRoute = async Astro => {
  const deviceIdBasis = String(Astro.params.deviceIdBasis)
  const { data: result } =
    await Astro.locals.backend.deviceAuthorizations.getDeviceAuthorization.get({
      query: { deviceIdBasis },
    })
  return new Response(JSON.stringify(result), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
