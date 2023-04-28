import CSRF from 'csrf'

import type { APIRoute } from 'astro'

export const get: APIRoute = async ({ redirect }) => {
  const csrfInstance = new CSRF()
  const csrfToken = csrfInstance.create(process.env.CSRF_SECRET ?? '')

  const loginURI = `https://www.eventpop.me/oauth/authorize?${new URLSearchParams(
    {
      client_id: import.meta.env.EVENTPOP_CLIENT_ID ?? '',
      redirect_uri:
        'https://dtinth.github.io/oauth_gateway/eventpop_callback.html',
      response_type: 'code',
      state: import.meta.env.PROD ? csrfToken : 'local'
    }
  ).toString()}`

  return redirect(loginURI, 307)
}
