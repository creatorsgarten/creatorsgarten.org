import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'

import { contentsgarten } from '$constants/contentsgarten'

import type { APIRoute } from 'astro'

interface Link {
  url: string
  changefreq: 'daily' | 'monthly' | 'weekly'
  priority: number
}

export const get: APIRoute = async () => {
  try {
    const stream = new SitemapStream({
      hostname: 'https://new.creatorsgarten.org',
    })

    const staticLinks = ['/', '/people', '/events']

    const wikiLinks = (await contentsgarten().search.query({})).results
      .map(item => item.pageRef)
      .map(pageRef => {
        if (pageRef.startsWith('Events/'))
          return `/event/${pageRef.replace('Events/', '')}`

        return `/wiki/${pageRef}`
      })

    const builtLinks: Link[] = [...staticLinks, ...wikiLinks].map(link => ({
      url: link,
      changefreq: 'daily',
      priority: 0.5,
    }))

    return new Response(
      await streamToPromise(Readable.from(builtLinks).pipe(stream)).then(data =>
        data.toString()
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'max-age=7200' // 2 hours
        },
      }
    )
  } catch (e) {
    return new Response('server error', {
      status: 500,
    })
  }
}
