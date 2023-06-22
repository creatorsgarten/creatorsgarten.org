import { ObjectId } from 'mongodb'

import { collections } from '$constants/mongo'
import { discordClient } from '$constants/secrets/discordClient'

import { getAuthenticatedUser } from './getAuthenticatedUser'
import { finalizeAuthentication } from './finalizeAuthentication'

import type { User } from '$types/mongo/User'

interface DiscordTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

interface DiscordMeResponse {
  id: number
  username: string
  global_name: string
  avatar: string
  banner: string
}

export const authenticateDiscord = async (
  code: string,
  existingAuthToken?: string
) => {
  const currentAuthenticatedUser = await getAuthenticatedUser(existingAuthToken)

  if (currentAuthenticatedUser === null) throw new Error('not-authenticated')

  try {
    // obtain access token
    console.log('[discord] token')
    const authorization = await fetch(
      'https://discord.com/api/v10/oauth2/token',
      {
        method: 'POST',
        body: Object.entries({
          client_id: discordClient.id,
          client_secret: discordClient.secret,
          code: code,
          redirect_uri: 'https://creatorsgarten.org/auth/callback',
          grant_type: 'authorization_code',
        })
          .map(([key, value]) => `${key}=${value}`)
          .join('&'),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ).then(o => {
      if (o.ok) return o.json() as Promise<DiscordTokenResponse>
      else throw o
    })

    // get user information
    console.log('[discord] ne')
    const user = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authorization.access_token}`,
      },
    }).then(o => {
      if (o.ok) return o.json() as Promise<DiscordMeResponse>
      else throw o
    })

    // make sure that this account does not connected to another account
    const existingUser = await collections.users.findOne({
      _id: { $ne: new ObjectId(currentAuthenticatedUser.sub) },
      'connections.discord.id': user.id,
    })
    if (existingUser !== null)
      throw new Error(
        'This connection has been connected to another account.'
      )

    // sync with mongo
    await collections.users.updateOne(
      { uid: currentAuthenticatedUser.uid },
      {
        $set: {
          connections: {
            ...currentAuthenticatedUser.connections,
            discord: {
              id: user.id,
              username: user.username,
            },
          },
        } satisfies Partial<User>,
      }
    )

    return finalizeAuthentication(currentAuthenticatedUser.uid)
  } catch (e) {
    if (e instanceof Error) throw e
    else throw new Error('Unable to verify authenticity of this connection.')
  }
}
