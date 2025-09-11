import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'

import { getVideoIndex } from '$functions/getVideos'

import type { APIRoute } from 'astro'

interface Link {
  url: string
  changefreq: 'daily' | 'monthly' | 'weekly'
  priority: number
  lastmod?: string
}

export const GET: APIRoute = async () => {
  try {
    const stream = new SitemapStream({
      hostname: 'https://creatorsgarten.org',
    })

    // Get all published videos
    const videoIndex = await getVideoIndex()
    
    // Add main videos page
    const videoLinks: Link[] = [
      {
        url: '/videos',
        changefreq: 'weekly',
        priority: 0.8,
      }
    ]

    // Add individual video pages
    for (const video of videoIndex.videos) {
      videoLinks.push({
        url: `/videos/${video.eventId}/${video.slug}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: video.publishDate && video.publishDate !== 'true' ? video.publishDate : undefined,
      })
    }

    // Add event video listing pages
    for (const eventGroup of videoIndex.events) {
      videoLinks.push({
        url: `/videos/${eventGroup.entity.id}`,
        changefreq: 'weekly',
        priority: 0.6,
      })
    }

    return new Response(
      await streamToPromise(Readable.from(videoLinks).pipe(stream)).then(data =>
        data.toString()
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'max-age=7200', // 2 hours
          'CDN-Cache-Control': 'max-age=7200', // 2 hours
        },
      }
    )
  } catch (e) {
    return new Response('server error', {
      status: 500,
    })
  }
}