import { contentsgarten } from '$constants/contentsgarten'
import type { APIRoute } from 'astro'
import { LRUCache } from 'lru-cache'

const contributors = new LRUCache({
  max: 10000,
  ttl: 5000,
  fetchMethod: async (pageRef: string) => {
    return contentsgarten().getContributors.query({ pageRef })
  },
})

export const GET: APIRoute = async opts => {
  const pageRef = String(opts.url.searchParams.get('pageRef'))
  const data = await contributors.fetch(pageRef)
  return new Response(JSON.stringify({ result: { data } }), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
