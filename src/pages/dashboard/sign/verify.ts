import type { APIRoute } from 'astro'

export const GET: APIRoute = async Astro => {
  const signature = String(Astro.url.searchParams.get('signature') || '')

  const fail = (message: string) =>
    new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  const result = await Astro.locals.backend.signatures.verifySignature.query({
    signature,
  })
  if (!result.verified) {
    return fail(result.error)
  } else {
    return new Response(JSON.stringify(result), {
      headers: { 'content-type': 'application/json' },
    })
  }
}
