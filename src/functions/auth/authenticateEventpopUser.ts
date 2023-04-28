import { mongo } from '$constants/mongo'

import type { AstroGlobal } from 'astro'
import { finalizeAuthentication } from './finalizeAuthentication'

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

export const authenticateEventpopUser = async (
  code: string,
  Astro: AstroGlobal
) => {
  try {
    // authenticate user to eventpop
    console.log('/oauth/token')
    const authorization = await fetch('https://www.eventpop.me/oauth/token', {
      method: 'POST',
      body: Object.entries({
        client_id: import.meta.env.EVENTPOP_CLIENT_ID,
        client_secret: import.meta.env.EVENTPOP_CLIENT_SECRET,
        code: code,
        redirect_uri: 'https://dtinth.github.io/oauth_gateway/eventpop_callback.html',
        grant_type: 'authorization_code',
      }).map(([key, value]) => `${key}=${value}`).join('&'),
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
            phone: user.phone,
          },
        },
        {
          upsert: true,
        }
      )

    return finalizeAuthentication(user.id, Astro)
  } catch (e) {
    console.error(e)
    throw new Error('eventpop-varification-failed')
  }
}
