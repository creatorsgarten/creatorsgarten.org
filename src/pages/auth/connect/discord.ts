import CSRF from 'csrf'

import { csrfSecret } from '$constants/secrets/csrfSecret'
import { discordClient } from '$constants/secrets/discordClient'

import type { APIRoute } from 'astro'

export const get: APIRoute = async ({ request, redirect }) => {
  const csrfInstance = new CSRF()
  const redirectHint =
    new URL(request.url).hostname === 'localhost' ? 'localhost3000' : 'new'
  const csrfToken = csrfInstance.create(csrfSecret ?? 'demodash')

  const loginURI = `https://discord.com/api/oauth2/authorize?${new URLSearchParams(
    {
      client_id: discordClient.id ?? '',
      redirect_uri: 'https://creatorsgarten.org/auth/callback',
      state: `${redirectHint}!/dashboard!discord-${csrfToken}`,
      response_type: 'code',
      scope: 'identify',
    }
  ).toString()}`

  return redirect(loginURI, 307)
}
