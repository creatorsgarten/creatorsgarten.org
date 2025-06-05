import { LRUCache } from 'lru-cache'
import { ofetch } from 'ofetch'

export interface SocialPost {
  id: string
  publishedAt: string
  url: string
  events: string[]
  picture?: string
  title: string
}

interface GristRecord {
  id: number
  fields: {
    post_id: string
    story: string
    status_type: string
    message: string
    permalink_url: string
    created_time: number
    event: string[]
    full_picture?: string
    title_override?: string
  }
}

interface GristResponse {
  records: GristRecord[]
}

const socialPostsFetcher = new LRUCache({
  max: 1,
  ttl: 300000,
  fetchMethod: async (_dummy: ''): Promise<{ socialPosts: SocialPost[] }> => {
    const response = await ofetch<GristResponse>(
      'https://grist.creatorsgarten.org/api/docs/2eCQzv9Ww9mraHnAafRUK9/tables/PR_Facebook/records'
    )

    const socialPosts = response.records
      .map(record => ({
        id: record.fields.post_id,
        publishedAt: new Date(record.fields.created_time * 1000).toISOString(),
        url: record.fields.permalink_url,
        events: record.fields.event || [],
        picture: record.fields.full_picture && record.fields.full_picture !== '-' ? record.fields.full_picture : undefined,
        title: record.fields.title_override || record.fields.message || record.fields.story || record.fields.status_type
      }))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return { socialPosts }
  }
})

export async function getAllSocialPosts(): Promise<{ socialPosts: SocialPost[] }> {
  const result = await socialPostsFetcher.fetch('')
  return result!
}

export async function getSocialPosts(eventId: string): Promise<{ socialPosts: SocialPost[] }> {
  const { socialPosts } = await getAllSocialPosts()
  const filteredPosts = socialPosts.filter(post => 
    post.events.includes(eventId)
  )
  return { socialPosts: filteredPosts }
}