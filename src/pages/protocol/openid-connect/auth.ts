import type { APIRoute } from 'astro'

export const GET: APIRoute = async Astro => {
  return new Response(null, {
    status: 302,
    headers: {
      location: `/auth/authorize?${Astro.url.searchParams}`,
    },
  })
}
