import { ObjectId } from 'mongodb'
import { AtpApi, AtpSessionData } from '@atproto/api'

import { collections } from '$constants/mongo'
import { blueskyClient } from '$constants/secrets/blueskyClient'

import { getAuthenticatedUser } from './getAuthenticatedUser'
import { finalizeAuthentication } from './finalizeAuthentication'

import type { User } from '$types/mongo/User'

interface BlueskyTokenResponse {
  access_token: string
  refresh_token: string
  scope: string
  token_type: string
}

interface BlueskyUserResponse {
  did: string
  handle: string
}

export const authenticateBluesky = async (
  code: string,
  existingAuthToken?: string
) => {
  const currentAuthenticatedUser = await getAuthenticatedUser(existingAuthToken)

  if (currentAuthenticatedUser === null) throw new Error('not-authenticated')

  try {
    // obtain access token
    console.log('[bluesky] token')
    const authorization = await fetch(
      'https://bsky.social/xrpc/com.atproto.server.createSession',
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: blueskyClient.id,
          client_secret: blueskyClient.secret,
          code: code,
          redirect_uri: 'https://creatorsgarten.org/auth/callback',
          grant_type: 'authorization_code',
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then(o => {
      if (o.ok) return o.json() as Promise<BlueskyTokenResponse>
      else throw o
    })

    // get user information
    console.log('[bluesky] user')
    const api = new AtpApi({ service: 'https://bsky.social' })
    api.setSession(authorization as AtpSessionData)
    const user = await api.com.atproto.identity.resolveHandle({
      handle: authorization.did,
    }).then(o => {
      if (o.success) return o.data as BlueskyUserResponse
      else throw o
    })

    // make sure that this account does not connected to another account
    const existingUser = await collections.users.findOne({
      _id: { $ne: new ObjectId(currentAuthenticatedUser.sub) },
      'connections.bluesky.did': user.did,
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
            bluesky: {
              did: user.did,
              handle: user.handle,
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
