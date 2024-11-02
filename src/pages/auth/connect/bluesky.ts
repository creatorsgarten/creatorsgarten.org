import CSRF from 'csrf'

import { csrfSecret } from '$constants/secrets/csrfSecret'
import { blueskyClient } from '$constants/secrets/blueskyClient'

import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, redirect }) => {
  const csrfInstance = new CSRF()
  const redirectHint =
    new URL(request.url).hostname === 'localhost' ? 'localhost3000' : 'new'
  const csrfToken = csrfInstance.create(csrfSecret ?? 'demodash')

  const loginURI = `https://bsky.social/xrpc/com.atproto.server.createSession?${new URLSearchParams(
    {
      client_id: blueskyClient.id ?? '',
      redirect_uri: 'https://creatorsgarten.org/auth/callback',
      state: `${redirectHint}!/dashboard!bluesky-${csrfToken}`,
      response_type: 'code',
      scope: 'openid',
    }
  ).toString()}`

  return redirect(loginURI, 307)
}
