import CSRF from 'csrf'
import { CSRF_SECRET, GITHUB_CLIENT_ID } from 'astro:env/server'

import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, redirect }) => {
  const csrfInstance = new CSRF()
  const redirectHint =
    new URL(request.url).hostname === 'localhost' ? 'localhost3000' : 'new'
  const csrfToken = csrfInstance.create(CSRF_SECRET ?? 'demodash')

  const loginURI = `https://github.com/login/oauth/authorize?${new URLSearchParams(
    {
      client_id: GITHUB_CLIENT_ID ?? '',
      redirect_uri: 'https://creatorsgarten.org/auth/callback',
      state: `${redirectHint}!/dashboard!github-${csrfToken}`,
    }
  ).toString()}`

  return redirect(loginURI, 307)
}
