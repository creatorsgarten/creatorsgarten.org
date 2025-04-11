import type { APIRoute } from 'astro'
import { RIFFY_API_CREDENTIALS } from 'astro:env/server'

import { getEvents } from '$functions/getEvents.ts'
import { getServiceAccountIdToken } from '$backend/gardenGate/getServiceAccountIdToken.ts'

export const GET: APIRoute = async ({ locals, request }) => {
  const eventId = new URL(request.url).searchParams.get('event')

  if (!eventId) return new Response('Event ID is required', { status: 400 })
  else if (!Number.isSafeInteger(Number(eventId)))
    return new Response('Event ID must be a number', { status: 400 })

  const joinedEvent = await getEvents().then(events =>
    events.find(e => e.eventpopId === Number(eventId))
  )

  if (!joinedEvent) return new Response('Event not found', { status: 404 })

  const joinedTicket = await locals.backend.events.getJoinedEvents
    .query()
    .then(tickets => tickets.find(t => t.id === Number(eventId)))

  if (!joinedTicket) return new Response('Ticket not found', { status: 404 })

  const payload = {
    user: JSON.stringify({
      name: `${joinedTicket.firstName} ${joinedTicket.lastName}`.trim(),
      ticket: {
        type: joinedTicket.ticketType.name,
        ref: joinedTicket.code,
      },
    }),
    event: JSON.stringify({
      id: joinedEvent.id,
      name: joinedEvent.name,
      date: joinedEvent.date.toISOString(),
      endDate: joinedEvent.endDate?.toISOString?.(),
      image: joinedEvent.image,
      location: joinedEvent.location,
    }),
  }

  const url = `https://api.rayriffy.com/walletPasses/garten/apple?${new URLSearchParams(payload).toString()}`
  const verifyToken = await getServiceAccountIdToken(
    'https://github.com/rayriffy/api',
    RIFFY_API_CREDENTIALS
  )

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${verifyToken}`,
    },
  })
}
