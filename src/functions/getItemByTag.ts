import { LRUCache } from 'lru-cache'
import { ofetch } from 'ofetch'

const itemFetcher = new LRUCache({
  max: 100,
  ttl: 300000,
  fetchMethod: async (tagId: string) => {
    const url = `https://creatorsgarten-inventory.deno.dev/items?tag=${tagId}`
    return (await ofetch(url)) as {
      id: string
      name: string
      description: string
      notes: string
    }[]
  },
})

export async function getItemByTag(tagId: string) {
  const items = await itemFetcher.fetch(tagId)
  return items![0]
}
