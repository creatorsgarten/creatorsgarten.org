import { type FrontMatter } from '$functions/parseFrontMatter'

export function getEventImageUrl(eventId: string, frontMatter: FrontMatter) {
  if (frontMatter.image) {
    return frontMatter.image
  }
  return `https://assets.creatorsgarten.org/events/${eventId}.png`
}
