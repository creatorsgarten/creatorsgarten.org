import CSRF from 'csrf'

import { csrfSecret } from '$constants/secrets/csrfSecret'
import { eventpopClient } from '$constants/secrets/eventpopClient'

import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, redirect, url }) => {
  const redirectDestination = url.searchParams.get('dest') ?? '/'

  const csrfInstance = new CSRF()
  const redirectHint =
    url.hostname === 'localhost' ? `localhost${url.port}` : 'new'
  const csrfToken = csrfInstance.create(csrfSecret ?? 'demodash')

  const loginURI = `https://www.eventpop.me/oauth/authorize?${new URLSearchParams(
    {
      client_id: eventpopClient.id ?? '',
      redirect_uri:
        'https://dtinth.github.io/oauth_gateway/eventpop_callback.html',
      response_type: 'code',
      state: `${redirectHint}!${redirectDestination}!eventpop-${csrfToken}`,
    }
  ).toString()}`

  return redirect(loginURI, 307)
}
