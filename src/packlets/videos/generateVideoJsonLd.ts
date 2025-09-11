import type { VideoListingItem } from '$functions/getVideos'
import type {
  Clip,
  Organization,
  Person,
  VideoObject,
  WithContext,
} from 'schema-dts'

/**
 * Generates JSON-LD structured data for a video page
 * Compliant with Google's video structured data requirements
 */
export function generateVideoJsonLd(
  video: VideoListingItem
): WithContext<VideoObject> {
  // Create Person objects for speakers
  const creators: Person[] = video.speakers.map(speaker => ({
    '@type': 'Person',
    name: speaker,
  }))

  // Creatorsgarten organization as publisher
  const publisher: Organization = {
    '@type': 'Organization',
    name: 'Creatorsgarten',
    url: 'https://creatorsgarten.org',
    logo: 'https://creatorsgarten.org/images/og.jpg',
  }

  // Generate video clips for chapters if available
  const clips: Clip[] | undefined = video.chapters?.map((chapter, index) => {
    const startOffset = Math.floor(chapter.time / 1000) // Convert ms to seconds
    const nextChapterTime = video.chapters?.[index + 1]?.time
    const endOffset = nextChapterTime
      ? Math.floor(nextChapterTime / 1000)
      : undefined

    return {
      '@type': 'Clip',
      name: chapter.title,
      startOffset,
      ...(endOffset && { endOffset }),
      url: `https://creatorsgarten.org/videos/${video.eventId}/${video.slug}?t=${startOffset}s`,
    }
  })

  const jsonLd: WithContext<VideoObject> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',

    // Required properties
    name: video.title,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.publishDate,

    // Recommended properties
    description:
      video.description ||
      `${video.title} by ${video.speakers.join(', ')} at ${video.eventTitle}`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    // Note: contentUrl omitted as we don't have direct access to YouTube's video files

    // Creator and publisher
    ...(creators.length > 0 && { creator: creators }),
    publisher,

    // Additional metadata
    ...(clips && clips.length > 0 && { hasPart: clips }),

    // Event context - using proper schema.org type
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      name: video.eventTitle,
      url: `https://creatorsgarten.org/videos/${video.eventId}`,
    },
  }

  return jsonLd
}
