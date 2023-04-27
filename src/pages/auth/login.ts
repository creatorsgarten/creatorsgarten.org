import type { APIRoute } from 'astro'

export const get: APIRoute = async ({ redirect }) => {
  const loginURI = `https://www.eventpop.me/oauth/authorize?${new URLSearchParams(
    {
      client_id: import.meta.env.EVENTPOP_CLIENT_ID ?? '',
      redirect_uri:
        'https://dtinth.github.io/oauth_gateway/eventpop_callback.html',
      response_type: 'code',
    }
  ).toString()}`

  return redirect(loginURI, 307)
}
