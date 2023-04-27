import dayjs from "dayjs"

import { contentsgarten } from "$constants/contentsgarten"

import type { EventFrontmatter } from "$types/EventFrontmatter"
import { readFileSystem, writeFileSystem } from "./fileSystem"

interface Event {
  id: string;
  name: string;
  date: dayjs.Dayjs;
  link: string
  location: string
}

export const getEvents = async () => {
  const cachedEvents = await readFileSystem<Event[]>(['events'])

  if (cachedEvents !== null)
    return cachedEvents.data.map(o => ({ ...o, date: dayjs(o.date) }))

  const fetchedEvents: Event[] = (
    await contentsgarten.search.query({
      prefix: 'Events/',
    })
  ).results
    .map(event => {
      const frontmatter = event.frontMatter as EventFrontmatter
      return {
        id: event.pageRef.replace('Events/', ''),
        name: frontmatter.name,
        date: dayjs(frontmatter.date),
        link: frontmatter.site,
        location: frontmatter.location,
      }
    })
    .sort((a, b) => {
      return b!.date.unix() - a!.date.unix()
    })

  await writeFileSystem(['events'], fetchedEvents)

  return fetchedEvents
}