import dayjs from 'dayjs'

import { contentsgarten } from '$constants/contentsgarten'
import { readFileSystem, writeFileSystem } from './fileSystem'
import { parseFrontMatter } from './parseFrontMatter'

export interface Event {
  id: string
  name: string
  date: dayjs.Dayjs
  endDate: dayjs.Dayjs | null
  image: string
  link?: string
  location?: string
  eventpopId?: number
}

export const getEvents = async () => {
  const cachedEvents = await readFileSystem<Event[]>(['events'])

  if (cachedEvents !== null)
    return cachedEvents.data.map(o => ({
      ...o,
      date: dayjs(o.date),
      endDate: o.endDate && dayjs(o.endDate),
    }))

  const fetchedEvents: Event[] = (
    await contentsgarten().search.query({
      prefix: 'Events/',
      match: { event: true },
    })
  ).results
    .flatMap((page): Event[] => {
      const frontmatter = parseFrontMatter(page.frontMatter)
      if (!frontmatter.success) return []
      const { event, image } = frontmatter.data
      if (!event) return []
      if (event.unlisted) return []

      const id = page.pageRef.replace('Events/', '')

      return [
        {
          id,
          name: event.name,
          date: dayjs(event.date),
          endDate: event.endDate ? dayjs(event.endDate) : null,
          link: event.site,
          image: image ?? `https://assets.creatorsgarten.org/events/${id}.png`,
          location: event.location,
          eventpopId: event.eventpopId,
        },
      ]
    })
    .sort((a, b) => {
      return b!.date.unix() - a!.date.unix()
    })

  await writeFileSystem(
    ['events'],
    fetchedEvents,
    1000 * 60 * 15 // 15 minutes
  )

  return fetchedEvents
}
