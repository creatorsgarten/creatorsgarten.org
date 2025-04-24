import { FIGMA_CLIENT_ID, FIGMA_CLIENT_SECRET } from 'astro:env/server'
import { ObjectId } from 'mongodb'
import { ofetch } from 'ofetch'

import { collections } from '$constants/mongo'

import { finalizeAuthentication } from './finalizeAuthentication'
import { getAuthenticatedUser } from './getAuthenticatedUser'

import type { User } from '$types/mongo/User'

interface FigmaTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
}

interface FigmaUserResponse {
  id: string
  email: string
  handle: string
}

export const authenticateFigma = async (
  code: string,
  existingAuthToken?: string
) => {
  const currentAuthenticatedUser = await getAuthenticatedUser(existingAuthToken)

  if (currentAuthenticatedUser === null) throw new Error('not-authenticated')

  try {
    // obtain access token
    console.log('[figma] token')
    let authorization: FigmaTokenResponse
    try {
      // Create form data using URLSearchParams
      const formData = new URLSearchParams({
        code,
        redirect_uri: 'https://creatorsgarten.org/auth/callback',
        grant_type: 'authorization_code',
      })

      // Create Basic Auth header using client_id:client_secret
      const credentials = btoa(`${FIGMA_CLIENT_ID}:${FIGMA_CLIENT_SECRET}`)

      authorization = await ofetch<FigmaTokenResponse>(
        'https://api.figma.com/v1/oauth/token',
        {
          method: 'POST',
          body: formData.toString(),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
          },
        }
      )
    } catch (error) {
      console.error('[figma] token error:', error)
      throw new Error(
        `Failed to obtain Figma access token: ${error instanceof Error ? error.message : String(error)}`
      )
    }

    // get user information
    console.log('[figma] user info')
    let user: FigmaUserResponse
    try {
      user = await ofetch<FigmaUserResponse>('https://api.figma.com/v1/me', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authorization.access_token}`,
        },
      })
    } catch (error) {
      console.error('[figma] user info error:', error)
      throw new Error(
        `Failed to fetch Figma user information: ${error instanceof Error ? error.message : String(error)}`
      )
    }

    // make sure that this account does not connected to another account
    const existingUser = await collections.users.findOne({
      _id: { $ne: new ObjectId(currentAuthenticatedUser.sub) },
      'connections.figma.id': user.id,
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
            figma: {
              id: user.id,
              email: user.email,
              handle: user.handle,
            },
          },
        } satisfies Partial<User>,
      }
    )

    return finalizeAuthentication(currentAuthenticatedUser.uid)
  } catch (e) {
    console.error('[figma] authentication error:', e)
    if (e instanceof Error) throw e
    else throw new Error('Unable to verify authenticity of this connection.')
  }
}
