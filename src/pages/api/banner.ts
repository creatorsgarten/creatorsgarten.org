import { getEvents } from '$functions/getEvents'
import { getOptimizedImageUrl } from '$functions/getOptimizedImageUrl'

import type { APIRoute } from 'astro'

export const get: APIRoute = async () => {
  const events = await getEvents()

  return {
    body: JSON.stringify({
      message: 'ok',
      data: {
        // gartenLogo will provide a special logo for the banner (rare occation, might change)
        gartenLogo: null,
        hacks: await Promise.all(
          events.map(async event => {
            const targetEventCoverImage =
              event.image ??
              `https://assets.creatorsgarten.org/events/${event.id}.png`

            return {
              id: event.id,
              name: event.name,
              date: event.date.toISOString(),
              banner: {
                original: targetEventCoverImage,
                compressed: getOptimizedImageUrl(targetEventCoverImage, {
                  width: 400,
                  quality: 85,
                }),
              },
            }
          })
        ),
      },
    }),
  }
}
