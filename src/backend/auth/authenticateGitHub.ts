import { githubClient } from '$constants/secrets/githubClient'
import { mongo } from '$constants/mongo'

import { getAuthenticatedUser } from './getAuthenticatedUser'
import { finalizeAuthentication } from './finalizeAuthentication'

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
    console.log('/oauth/access_token')
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

    console.log('/user')
    // get github user information
    const user = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${authorization.access_token}`,
      },
    }).then(o => {
      if (o.ok) return o.json() as Promise<GitHubUserResponse>
      else throw o
    })

    // sync with mongo
    await mongo
      .db('creatorsgarten-org')
      .collection('users')
      .updateOne(
        { uid: currentAuthenticatedUser.uid },
        {
          $set: {
            connections: {
              github: {
                id: user.id,
                username: user.login,
              },
            },
          },
        }
      )

    return finalizeAuthentication(currentAuthenticatedUser.uid)
  } catch (e) {
    throw new Error('github-varification-failed')
  }
}
