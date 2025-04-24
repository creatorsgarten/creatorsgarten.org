import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'astro:env/server'
import { ObjectId } from 'mongodb'

import { collections } from '$constants/mongo'

import { finalizeAuthentication } from './finalizeAuthentication'
import { getAuthenticatedUser } from './getAuthenticatedUser'

import type { User } from '$types/mongo/User'

interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
  id_token: string
}

interface GoogleUserResponse {
  id: string
  email: string
  name: string
  picture?: string
  verified_email: boolean
}

export const authenticateGoogle = async (
  code: string,
  existingAuthToken?: string
) => {
  const currentAuthenticatedUser = await getAuthenticatedUser(existingAuthToken)

  if (currentAuthenticatedUser === null) throw new Error('not-authenticated')

  try {
    // obtain access token
    console.log('[google] token')
    const authorization = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: Object.entries({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
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
    }).then(o => {
      if (o.ok) return o.json() as Promise<GoogleTokenResponse>
      else throw o
    })

    // get user information
    console.log('[google] user info')
    const user = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authorization.access_token}`,
      },
    }).then(o => {
      if (o.ok) return o.json() as Promise<GoogleUserResponse>
      else throw o
    })

    // make sure that this account does not connected to another account
    const existingUser = await collections.users.findOne({
      _id: { $ne: new ObjectId(currentAuthenticatedUser.sub) },
      'connections.google.id': user.id,
    })
    if (existingUser !== null)
      throw new Error('This connection has been connected to another account.')

    // sync with mongo
    await collections.users.updateOne(
      { uid: currentAuthenticatedUser.uid },
      {
        $set: {
          connections: {
            ...currentAuthenticatedUser.connections,
            google: {
              id: user.id,
              email: user.email,
              name: user.name,
              picture: user.picture,
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
