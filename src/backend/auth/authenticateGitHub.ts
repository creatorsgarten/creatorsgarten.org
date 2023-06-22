import { ObjectId } from 'mongodb'

import { githubClient } from '$constants/secrets/githubClient'
import { collections } from '$constants/mongo'

import { getAuthenticatedUser } from './getAuthenticatedUser'
import { finalizeAuthentication } from './finalizeAuthentication'

import type { User } from '$types/mongo/User'

interface GitHubTokenResponse {
  access_token: string
  scope: string
  token_type: string
}

interface GitHubUserResponse {
  id: number
  login: string
}

export const authenticateGitHub = async (
  code: string,
  existingAuthToken?: string
) => {
  const currentAuthenticatedUser = await getAuthenticatedUser(existingAuthToken)

  if (currentAuthenticatedUser === null) throw new Error('not-authenticated')

  try {
    // authenticate user to github
    console.log('[github] token')
    const authorization = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        body: Object.entries({
          client_id: githubClient.id,
          client_secret: githubClient.secret,
          code: code,
          redirect_uri: 'https://creatorsgarten.org/auth/callback',
        })
          .map(([key, value]) => `${key}=${value}`)
          .join('&'),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ).then(o => {
      if (o.ok) return o.json() as Promise<GitHubTokenResponse>
      else throw o
    })

    // get github user information
    console.log('[github] user')
    const user = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${authorization.access_token}`,
      },
    }).then(o => {
      if (o.ok) return o.json() as Promise<GitHubUserResponse>
      else throw o
    })

    // make sure that this account does not connected to another account
    const existingUser = await collections.users.findOne({
      _id: { $ne: new ObjectId(currentAuthenticatedUser.sub) },
      'connections.github.id': user.id,
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
            github: {
              id: user.id,
              username: user.login,
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
