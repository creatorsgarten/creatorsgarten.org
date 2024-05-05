import type { APIRoute } from 'astro'

export const GET: APIRoute = async Astro => {
  const deviceIdBasis = String(Astro.params.deviceIdBasis)
  const { data } = await Astro.locals.eden.deviceAuthorization.index.get({
    deviceIdBasis,
  })
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
