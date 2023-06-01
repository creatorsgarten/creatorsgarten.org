import dayjs from 'dayjs'

import { contentsgarten } from '$constants/contentsgarten'
import { readFileSystem, writeFileSystem } from './fileSystem'
import { parseFrontMatter } from './parseFrontMatter'

export interface Event {
  id: string
  name: string
  date: dayjs.Dayjs
  endDate: dayjs.Dayjs | null
  link?: string
  image?: string
  location?: string
}

export const getEvents = async () => {
  const cachedEvents = await readFileSystem<Event[]>(['events'])

  if (cachedEvents !== null)
    return cachedEvents.data.map(o => ({ ...o, date: dayjs(o.date) }))

  const fetchedEvents: Event[] = (
    await contentsgarten().search.query({
      prefix: 'Events/',
      match: { event: true },
    })
  ).results
    .flatMap((page): Event[] => {
      console.log(page)
      const frontmatter = parseFrontMatter(page.frontMatter)
      if (!frontmatter.success) return []
      const { event, image } = frontmatter.data
      if (!event) return []
      if (event.unlisted) return []
      return [
        {
          id: page.pageRef.replace('Events/', ''),
          name: event.name,
          date: dayjs(event.date),
          endDate: event.endDate ? dayjs(event.endDate) : null,
          link: event.site,
          image,
          location: event.location,
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
