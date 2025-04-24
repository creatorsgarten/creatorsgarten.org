import type { APIRoute } from 'astro'
import { CSRF_SECRET, FIGMA_CLIENT_ID } from 'astro:env/server'
import CSRF from 'csrf'

export const GET: APIRoute = async ({ request, redirect }) => {
  const csrfInstance = new CSRF()
  const redirectHint =
    new URL(request.url).hostname === 'localhost' ? 'localhost3000' : 'new'
  const csrfToken = csrfInstance.create(CSRF_SECRET ?? 'demodash')

  const loginURI = `https://www.figma.com/oauth?${new URLSearchParams({
    client_id: FIGMA_CLIENT_ID ?? '',
    redirect_uri: 'https://creatorsgarten.org/auth/callback',
    response_type: 'code',
    state: `${redirectHint}!/dashboard/profile!figma-${csrfToken}`,
    scope: 'current_user:read',
  }).toString()}`

  return redirect(loginURI, 307)
}
