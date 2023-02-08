import { getCollection } from 'astro:content'
import { getImage } from '@astrojs/image'

import type { APIRoute } from 'astro'

export const get: APIRoute = async () => {
  const events = (await getCollection('event')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  )

  return {
    body: JSON.stringify({
      message: 'ok',
      data: {
        // gartenLogo will provide a special logo for the banner (rare occation, might change)
        gartenLogo: null,
        hacks: await Promise.all(
          events.map(async event => ({
            id: event.slug,
            name: event.data.name,
            date: event.data.date.toISOString(),
            banner: {
              original: `https://creatorsgarten.org/images/events/${event.slug}.png`,
              compressed:
                'https://creatorsgarten.org' +
                (await getImage({
                  src: `/images/events/${event.slug}.png`,
                  alt: '',
                  aspectRatio: 1,
                  width: 360,
                  quality: 85,
                  format: 'webp',
                }).then(o => o.src)),
            },
          }))
        ),
      },
    }),
  }
}
