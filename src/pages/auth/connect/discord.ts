import type { APIRoute } from 'astro'
import { CSRF_SECRET, DISCORD_CLIENT_ID } from 'astro:env/server'
import CSRF from 'csrf'

export const GET: APIRoute = async ({ request, redirect }) => {
  const csrfInstance = new CSRF()
  const redirectHint =
    new URL(request.url).hostname === 'localhost' ? 'localhost3000' : 'new'
  const csrfToken = csrfInstance.create(CSRF_SECRET ?? 'demodash')

  const loginURI = `https://discord.com/api/oauth2/authorize?${new URLSearchParams(
    {
      client_id: DISCORD_CLIENT_ID ?? '',
      redirect_uri: 'https://creatorsgarten.org/auth/callback',
      state: `${redirectHint}!/dashboard/profile!discord-${csrfToken}`,
      response_type: 'code',
      scope: 'identify',
    }
  ).toString()}`

  return redirect(loginURI, 307)
}
