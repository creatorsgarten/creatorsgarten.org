import type { APIRoute } from 'astro'
import { getBackend } from '$functions/getBackend'

export const get: APIRoute = async Astro => {
  const base = Astro.url.origin
  const body = JSON.stringify({
    id_token_signing_alg_values_supported: ['RS256'],
    issuer: 'https://creatorsgarten.org',
    jwks_uri: `${base}/.well-known/jwks`,
    authorization_endpoint: `${base}/auth/authorize`,
    response_types_supported: ['id_token'],
    subject_types_supported: ['public', 'pairwise'],
  })
  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
