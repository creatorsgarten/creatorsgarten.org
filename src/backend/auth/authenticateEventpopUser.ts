import { finalizeAuthentication } from './finalizeAuthentication'

import { mongo } from '$constants/mongo'
import { eventpopClient } from '$constants/secrets/eventpopClient'

interface EventpopAuthorizationResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
  created_at: number
}

interface EventpopMeResponse {
  user: {
    id: number
    full_name: string
    email: string
    avatar: string
    avatars: {
      original: string
      medium: string
      thumb: string
      tiny: string
    }
    birthday: string
    gender: string
    phone: string
  }
}

export const authenticateEventpopUser = async (code: string) => {
  try {
    // authenticate user to eventpop
    console.log('/oauth/token')
    const authorization = await fetch('https://www.eventpop.me/oauth/token', {
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
    }).then(o => {
      if (o.ok) return o.json() as Promise<EventpopAuthorizationResponse>
      else throw o
    })

    // check who it is
    console.log('/me')
    const { user } = await fetch(
      `https://eventpop.me/api/public/me?${new URLSearchParams({
        access_token: authorization.access_token,
      }).toString()}`
    ).then(o => {
      if (o.ok) return o.json() as Promise<EventpopMeResponse>
      else throw o
    })

    // sync with mongo
    await mongo
      .db('creatorsgarten-org')
      .collection('users')
      .updateOne(
        { uid: user.id },
        {
          $set: {
            uid: user.id,
            name: user.full_name,
            avatar: user.avatar,
            email: user.email,
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
