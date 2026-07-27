import type { APIRoute } from 'astro'

export const GET: APIRoute = async Astro => {
  const signature = String(Astro.url.searchParams.get('signature') || '')

  const fail = (message: string) =>
    new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  const { data: result } =
    await Astro.locals.backend.signatures.verifySignature.get({
      query: { signature },
    })
  if (!result) {
    return fail('Failed to verify signature')
  }
  if (!result.verified) {
    return fail(result.error)
  } else {
    return new Response(JSON.stringify(result), {
      headers: { 'content-type': 'application/json' },
    })
  }
}
