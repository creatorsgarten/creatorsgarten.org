import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  const base = url.origin
  const body = JSON.stringify({
    id_token_signing_alg_values_supported: ['RS256'],
    issuer: 'https://creatorsgarten.org',
    jwks_uri: `${base}/.well-known/jwks`,
    authorization_endpoint: `${base}/auth/authorize`,
    token_endpoint: `${base}/auth/token`,
    userinfo_endpoint: `${base}/auth/userinfo`,
    response_types_supported: ['id_token', 'code'],
    subject_types_supported: ['public', 'pairwise'],
  })
  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
