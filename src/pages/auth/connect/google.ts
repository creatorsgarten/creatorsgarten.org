import type { APIRoute } from 'astro'
import { CSRF_SECRET, GOOGLE_CLIENT_ID } from 'astro:env/server'
import CSRF from 'csrf'

export const GET: APIRoute = async ({ request, redirect }) => {
  const csrfInstance = new CSRF()
  const redirectHint =
    new URL(request.url).hostname === 'localhost' ? 'localhost3000' : 'new'
  const csrfToken = csrfInstance.create(CSRF_SECRET ?? 'demodash')

  const loginURI = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
    {
      client_id: GOOGLE_CLIENT_ID ?? '',
      redirect_uri: 'https://creatorsgarten.org/auth/callback',
      response_type: 'code',
      state: `${redirectHint}!/dashboard/profile!google-${csrfToken}`,
      scope: 'email profile',
      access_type: 'offline',
      prompt: 'consent',
    }
  ).toString()}`

  return redirect(loginURI, 307)
}
