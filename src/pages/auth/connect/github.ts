import CSRF from 'csrf'

import { csrfSecret } from '$constants/secrets/csrfSecret'
import { githubClient } from '$constants/secrets/githubClient'

import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, redirect }) => {
  const csrfInstance = new CSRF()
  const redirectHint =
    new URL(request.url).hostname === 'localhost' ? 'localhost3000' : 'new'
  const csrfToken = csrfInstance.create(csrfSecret ?? 'demodash')

  const loginURI = `https://github.com/login/oauth/authorize?${new URLSearchParams(
    {
      client_id: githubClient.id ?? '',
      redirect_uri: 'https://creatorsgarten.org/auth/callback',
      state: `${redirectHint}!/dashboard!github-${csrfToken}`,
    }
  ).toString()}`

  return redirect(loginURI, 307)
}
