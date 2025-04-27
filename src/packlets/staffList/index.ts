import { contentsgarten } from '$constants/contentsgarten'
import type { Backend } from '$functions/getBackend'
import { parseFrontMatter, type FrontMatter } from '$functions/parseFrontMatter'
import { normalizeUsername } from '$functions/usernameValidation'

interface EventInvolvementEntry {
  pageRef: string
  eventId: string
  parsedFrontMatter: FrontMatter
  event: NonNullable<FrontMatter['event']>
}

export interface PersonSummary {
  id: string
  username: string
  name: string
  role: 'lead' | 'speaker' | 'staff'
  href?: string
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
        ? [
            {
              ...r,
              eventId: r.pageRef.split('/')[1],
              parsedFrontMatter: parsed.data,
              event: parsed.data.event,
            },
          ]
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

// Create a function to fetch people involved in an event
export async function getPeopleInvolved(eventId: string, backend: Backend): Promise<{
  groups: {
    title: string
    people: PersonSummary[]
  }[]
}> {
  const wiki = contentsgarten()

  // Get the event page to access its metadata
  const eventPage = await wiki.search.query({
    pageRef: [`Events/${eventId}`],
  })

  if (!eventPage.results.length) {
    return { groups: [] }
  }

  const parsed = parseFrontMatter(eventPage.results[0].frontMatter)
  if (!parsed.success || !parsed.data.event) {
    return { groups: [] }
  }

  const event = parsed.data.event

  // Collect usernames with their roles
  const peopleWithRoles: {
    username: string
    role: 'lead' | 'speaker' | 'staff'
  }[] = []

  // Add leads
  if (event.leads?.length) {
    for (const username of event.leads) {
      peopleWithRoles.push({
        username,
        role: 'lead',
      })
    }
  }

  // Add speakers
  if (event.speakers?.length) {
    for (const username of event.speakers) {
      peopleWithRoles.push({
        username,
        role: 'speaker',
      })
    }
  }

  // Add staff
  if (event.staff?.length) {
    for (const username of event.staff) {
      peopleWithRoles.push({
        username,
        role: 'staff',
      })
    }
  }

  // Get all unique usernames
  const usernames = [...new Set(peopleWithRoles.map(p => p.username))]

  // Add @ prefix to usernames to indicate they are usernames, not IDs
  const usernamesWithPrefix = usernames.map(username => `@${username}`)

  // Fetch public profiles for all collected usernames
  const profiles = await backend.users.getPublicProfiles.query({
    userIds: usernamesWithPrefix,
  })

  // Create a map of username to profile for easy lookup
  type Profile = (typeof profiles)[number]
  const profileMap = new Map<string, Profile>()
  profiles.forEach(profile => {
    if (profile.username) {
      profileMap.set(normalizeUsername(profile.username), profile)
    }
  })

  // Create PersonSummary objects for valid profiles only
  const people: PersonSummary[] = peopleWithRoles.flatMap(person => {
    const normalizedUsername = normalizeUsername(person.username)
    const profile = profileMap.get(normalizedUsername)
    if (!profile) return []
    return [
      {
        id: profile.id,
        username: person.username,
        name: profile.profileInformation?.name || person.username,
        role: person.role,
        href: profile.profileInformation ? `/wiki/People/${profile.username}` : undefined,
      },
    ]
  })

  // Group people by role
  const groups = [
    {
      title: 'Leads',
      people: people.filter(p => p.role === 'lead'),
    },
    {
      title: 'Speakers',
      people: people.filter(p => p.role === 'speaker'),
    },
    {
      title: 'Volunteers',
      people: people.filter(p => p.role === 'staff'),
    },
  ].filter(group => group.people.length > 0)

  return { groups }
}
