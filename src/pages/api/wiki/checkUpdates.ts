import type { APIRoute } from 'astro'
import { contentsgarten } from '$constants/contentsgarten'
import {
  getContentHash,
  getMarkdownFromSlug,
} from '$functions/getMarkdownFromSlug'
import { purgeFileSystem } from '$functions/fileSystem'
import { LRUCache } from 'lru-cache'

const updates = new LRUCache({
  max: 10000,
  ttl: 5000,
  fetchMethod: async (pageRef: string) => {
    const cached = await getMarkdownFromSlug(pageRef)
    const latest = await contentsgarten().view.query({
      pageRef,
      revalidate: true,
    })
    const cachedHash = getContentHash(cached)
    const latestHash = getContentHash(latest)
    if (cachedHash !== latestHash) {
      // New content available, purge cache
      await purgeFileSystem(['wiki', pageRef])
    }
    return { latestHash, status: latest.status }
  },
})

export const get: APIRoute = async opts => {
  const pageRef = String(opts.url.searchParams.get('pageRef'))
  const data = await updates.fetch(pageRef)
  return new Response(JSON.stringify({ result: { data } }), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
