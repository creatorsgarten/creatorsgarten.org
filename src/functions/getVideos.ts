import { Comparator } from '@dtinth/comparator'
import { LRUCache } from 'lru-cache'
import { ofetch } from 'ofetch'
import { getEvents, type Event } from './getEvents'

function tally<K>(map: Map<K, number>, key: K) {
  map.set(key, (map.get(key) || 0) + 1)
}

const vttFetcher = new LRUCache({
  max: 100,
  ttl: 300000,
  fetchMethod: async (subtitleRef: string) => {
    const url = `https://raw.githubusercontent.com/creatorsgarten/videos/main/data/videos/${subtitleRef}.vtt`
    return await ofetch(url, { responseType: 'text' })
  },
})

interface VideoEvent {
  id: string
  name: string
  url: string
  externalOrganizer?: {
    name: string
    url: string
  }
}

interface VideoListingEvent {
  id: string
  name: string
  externalUrl?: string
}

/**
 * Combine event information from Creatorsgarten’s event DB and video listing DB.
 * In case of conflict, our own event DB takes precedence.
 */
function getEventMap(videoEvents: VideoEvent[], gartenEvents: Event[]) {
  const eventMap = new Map<string, VideoListingEvent>()
  for (const event of gartenEvents) {
    eventMap.set(event.id, {
      id: event.id,
      name: event.name,
    })
  }
  for (const event of videoEvents) {
    if (eventMap.has(event.id)) continue
    eventMap.set(event.id, {
      id: event.id,
      name: event.name,
      externalUrl: event.url.startsWith('https://grtn.org')
        ? undefined
        : event.url,
    })
  }
  return eventMap
}

/**
 * Create a map from event ID to the publish date of the first video in that event.
 */
function getFirstPublishDateMap(videos: GetVideosResponse['videos']) {
  const publishedMap = new Map<string, string>()
  for (const video of videos) {
    if (typeof video.data.published === 'string') {
      const existing = publishedMap.get(video.event)
      publishedMap.set(
        video.event,
        !existing || video.data.published < existing
          ? video.data.published
          : existing
      )
    }
  }
  return publishedMap
}

/**
 * Create a map from event ID to the date of the event based on our event DB
 * (plus some manual adjustments).
 */
function getEventDateMap(events: Event[]) {
  const map = new Map(
    events.map(event => [event.id, event.date.toISOString().slice(0, 10)])
  )

  // Adjust some events manually
  map.set('universe2023', '2023-11-18')

  return map
}

const indexFetcher = new LRUCache({
  max: 1,
  ttl: 300000,
  fetchMethod: async (_dummy: ''): Promise<VideoIndex> => {
    const gartenEvents = await getEvents()
    const { videos, events: videoEvents } = await ofetch<GetVideosResponse>(
      'https://creatorsgarten.github.io/videos/videos.json'
    )

    const eventMap = getEventMap(videoEvents, gartenEvents)

    // Sort events by date
    const publishedMap = getFirstPublishDateMap(videos)
    const eventDateMap = getEventDateMap(gartenEvents)
    const events = Array.from(eventMap.values()).sort(
      Comparator.comparing(
        (event: VideoListingEvent) =>
          publishedMap.get(event.id) ??
          eventDateMap.get(event.id) ??
          '0000-00-00'
      ).reversed()
    )

    const eventIndexMap = new Map(
      events.map((event, index) => [event.id, index])
    )
    const eventIdTally = new Map<string, number>()
    const speakerNameTally = new Map<string, number>()
    const videoListingItems = videos
      .filter(video => {
        return (
          video.data.published === true ||
          (typeof video.data.published === 'string' &&
            new Date().toISOString() >= video.data.published)
        )
      })
      .map((video): VideoListingItem => {
        const thumbnailUrl = `http://img.youtube.com/vi/${video.data.youtube}/hqdefault.jpg`
        const event = eventMap.get(video.event)
        let chapters: Chapter[] | undefined
        if (video.data.chapters) {
          const localized = Object.fromEntries(
            Object.entries(video.data.chapters).map(([time, title]) => [
              time,
              typeof title === 'string' ? title : title.th,
            ])
          )
          chapters = processChapters(localized)
        }
        return {
          thumbnailUrl,
          title: video.data.title,
          speakers: (video.data.speaker || video.data.team?.name || '')
            .split(/;\s*/)
            .map(speaker => speaker.trim())
            .filter(speaker => speaker),
          eventId: video.event,
          eventTitle: event?.name || video.event,
          publishDate: String(video.data.published),
          slug: video.slug,
          youtubeId: video.data.youtube,
          description: video.data.description || video.data.englishDescription,
          chapters,
          transcriptRef: video.data.subtitles?.includes('th')
            ? `${video.event}/${video.slug}_th`
            : video.data.subtitles?.includes('en')
              ? `${video.event}/${video.slug}_en`
              : undefined,
        }
      })
      .sort(
        Comparator.comparing(
          (video: VideoListingItem) => eventIndexMap.get(video.eventId) ?? 9999
        )
          .thenComparing(video => video.publishDate, Comparator.reverseOrder())
          .thenComparing(v => v.slug)
      )

    for (const item of videoListingItems) {
      tally(eventIdTally, item.eventId)
      for (const speaker of item.speakers) {
        tally(speakerNameTally, speaker)
      }
    }
    const speakers = Array.from(speakerNameTally.keys()).sort((a, b) =>
      a.localeCompare(b)
    )

    return {
      videos: videoListingItems,
      events: events
        .filter(event => eventIdTally.has(event.id))
        .map(event => ({
          entity: event,
          count: videoListingItems.filter(video => video.eventId === event.id)
            .length,
        })),
      speakers: speakers.map(speaker => ({
        entity: speaker,
        count: videoListingItems.filter(video =>
          video.speakers.includes(speaker)
        ).length,
      })),
    }
  },
})

export async function getVideoIndex(): Promise<VideoIndex> {
  const result = await indexFetcher.fetch('')
  return result!
}

export async function getVtt(subtitleRef: string): Promise<string> {
  const result = await vttFetcher.fetch(subtitleRef)
  return result!
}

type VideoFilter =
  | undefined
  | { type: 'event'; eventId: string }
  | { type: 'speaker'; speaker: string }

export function filterVideos(
  index: VideoIndex,
  filter: VideoFilter
): FilteredListing {
  return {
    filter,
    filteredVideos: index.videos.filter(video => {
      if (filter === undefined) return true
      if (filter.type === 'event') {
        return video.eventId === filter.eventId
      } else if (filter.type === 'speaker') {
        return video.speakers.includes(filter.speaker)
      }
    }),
    relatedEvent:
      filter?.type === 'event'
        ? index.events.find(event => event.entity.id === filter.eventId)?.entity
        : undefined,
    index,
  }
}

export interface VideoIndex {
  videos: VideoListingItem[]
  events: FilterListing<VideoListingEvent>[]
  speakers: FilterListing<string>[]
}

export interface FilteredListing {
  filter: VideoFilter
  filteredVideos: VideoListingItem[]
  relatedEvent?: VideoListingEvent | undefined
  index: VideoIndex
}

export interface FilterListing<T> {
  entity: T
  count: number
}

export interface VideoListingItem {
  thumbnailUrl: string
  title: string
  speakers: string[]
  eventId: string
  eventTitle: string
  publishDate: string
  slug: string
  youtubeId: string
  description?: string
  chapters?: Chapter[]
  transcriptRef?: string
}

export interface Chapter {
  time: number
  title: string
}

function processChapters(records: Record<string, string>): Chapter[] {
  return Object.entries(records).map(([time, title]) => ({
    time: parseTime(time),
    title,
  }))
}

function parseTime(time: string): number {
  const split = time.split(':')
  return split.reduce((acc, t) => acc * 60 + parseFloat(t), 0) * 1000
}

export interface GetVideosResponse {
  videos: Video[]
  events: VideoEvent[]
}

export interface Video {
  event: string
  slug: string
  data: Data
  content: string
  filePath: string
  imageFilePath: string
  thaiSubtitlePath?: string
  englishSubtitlePath?: string
}

export interface Data {
  title: string
  type: Type
  youtube: string
  managed: boolean
  published?: boolean | string
  subtitles?: string[]
  tagline?: string
  description?: string
  speaker?: string
  team?: Team
  tags?: string[]
  youtubeTitle?: LocalizedString
  englishDescription?: string
  chapters: Record<string, LocalizedString>
}

export interface Team {
  name: string
}

export enum Type {
  Archive = 'archive',
  Pitch = 'pitch',
  Talk = 'talk',
}

export type LocalizedString = string | { en: string; th: string }
