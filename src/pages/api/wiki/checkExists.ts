import { contentsgarten } from '$constants/contentsgarten'
import type { APIRoute } from 'astro'
import DataLoader from 'dataloader'
import { LRUCache } from 'lru-cache'

const batchLoadPages = new DataLoader(
  async (pageRefs: readonly string[]) => {
    batchLoadPages.clearAll()
    const searched = await contentsgarten().search.query({
      pageRef: [...pageRefs],
    })
    const found = new Set(searched.results.map(r => r.pageRef))
    return pageRefs.map(pageRef => found.has(pageRef))
  },
  { maxBatchSize: 20 }
)

const cache = new LRUCache<string, boolean>({
  max: 10000,
  ttl: 60000,
  fetchMethod: async (pageRef: string) => {
    const found = await batchLoadPages.load(pageRef)
    return found
  },
})

export const GET: APIRoute = async ({ url }) => {
  const pageRefsParam = url.searchParams.get('pageRefs')
  if (!pageRefsParam) {
    return new Response('Missing pageRefs parameter', { status: 400 })
  }

  const pageRefs = String(pageRefsParam).split(',').slice(0, 20)
  const existingPages = await Promise.all(pageRefs.map(ref => cache.fetch(ref)))
  const result = pageRefs.filter((_, index) => existingPages[index])
  return new Response(JSON.stringify({ result }), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
