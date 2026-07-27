import type { APIRoute } from 'astro'
import { app } from '$backend'

export const ALL: APIRoute = ({ request }) => {
  const url = new URL(request.url)
  url.pathname = url.pathname.replace(/^\/api\/backend/, '') || '/'
  return app.handle(new Request(url, request))
}
