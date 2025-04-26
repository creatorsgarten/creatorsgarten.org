import { contentsgarten } from '$constants/contentsgarten'
import { parseFrontMatter, type FrontMatter } from '$functions/parseFrontMatter'

interface EventInvolvementEntry {
  pageRef: string
  eventId: string
  parsedFrontMatter: FrontMatter
  event: NonNullable<FrontMatter['event']>
}

export async function getEventInvolvements(username: string) {
  const wiki = contentsgarten()
  const rawResults = await Promise.all([
    wiki.search.query({
      match: { 'event.staff': username },
      prefix: 'Events/',
    }),
    wiki.search.query({
      match: { 'event.speakers': username },
      prefix: 'Events/',
    }),
    wiki.search.query({
      match: { 'event.leads': username },
      prefix: 'Events/',
    }),
  ])
  const results = rawResults.flatMap(r =>
    r.results.flatMap(r => {
      const parsed = parseFrontMatter(r.frontMatter)
      if (!parsed.success) return []
      return parsed.data.event
        ? [{ ...r,
            eventId: r.pageRef.split('/')[1],
            parsedFrontMatter: parsed.data,
            event: parsed.data.event }]
        : []
    })
  )
  const pages = new Map(results.map(r => [r.pageRef, r]))
  const events = Array.from(pages.values()).sort((a, b) =>
    b.event.date < a.event.date ? -1 : 1
  )

  const groups: {
    title: string
    events: EventInvolvementEntry[]
  }[] = []
  groups.push({
    title: 'Lead',
    events: events.filter(e => e.event.leads.includes(username)),
  })
  groups.push({
    title: 'Speaker',
    events: events.filter(e => e.event.speakers.includes(username)),
  })
  groups.push({
    title: 'Volunteer',
    events: events.filter(e => e.event.staff.includes(username)),
  })
  return { groups: groups.filter(g => g.events.length > 0) }
}
