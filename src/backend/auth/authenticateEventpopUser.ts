import { finalizeAuthentication } from './finalizeAuthentication'

import { collections } from '$constants/mongo'
import { eventpopClient } from '$constants/secrets/eventpopClient'

import { getEventpopUser } from 'src/backend/auth/getEventpopUser'
import { getEventpopUserTickets } from 'src/backend/auth/getEventpopUserTickets'

interface EventpopAuthorizationResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
  created_at: number
}

export const authenticateEventpopUser = async (code: string) => {
  try {
    // authenticate user to eventpop
    console.log('/oauth/token')
    const { access_token } = await fetch(
      'https://www.eventpop.me/oauth/token',
      {
        method: 'POST',
        body: Object.entries({
          client_id: eventpopClient.id,
          client_secret: eventpopClient.secret,
          code: code,
          redirect_uri:
            'https://dtinth.github.io/oauth_gateway/eventpop_callback.html',
          grant_type: 'authorization_code',
        })
          .map(([key, value]) => `${key}=${value}`)
          .join('&'),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ).then(o => {
      if (o.ok) return o.json() as Promise<EventpopAuthorizationResponse>
      else throw o
    })

    const [user, tickets] = await Promise.all([
      // check who it is
      getEventpopUser(access_token),
      // check event tickets
      getEventpopUserTickets(access_token),
    ])
    // console.log(access_token)

    // sync with mongo
    await collections.users.updateOne(
      { uid: user.id },
      {
        $set: {
          uid: user.id,
          name: user.full_name,
          avatar: user.avatar,
          email: user.email,
          accessedAt: new Date(),
          events: tickets.map(t => ({
            id: t.event_id,
            ticketId: t.id,
            code: t.reference_code,
            firstName: t.firstname,
            lastName: t.lastname,
            email: t.email,
            ticketType: {
              name: t.ticket_type.name,
              id: t.ticket_type.id,
            },
          })),
        },
      },
      {
        upsert: true,
      }
    )

    return finalizeAuthentication(user.id)
  } catch (e) {
    console.error(e)
    throw new Error('eventpop-varification-failed')
  }
}
