import jwt from 'jsonwebtoken'

import { maxSessionAge } from '$constants/maxSessionAge'
import { collections } from '$constants/mongo'
import { JWT_PRIVATE_KEY } from 'astro:env/server'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'

export const finalizeAuthentication = async (uid: number) => {
  // get mongo document
  const userDoc = await collections.users.findOne({ uid })

  if (userDoc === null) throw new Error('unsuccessful-authentication')

  const payload: AuthenticatedUser = {
    sub: String(userDoc._id),
    uid: userDoc.uid,
    name: userDoc.name,
    avatar: userDoc.avatar,
    email: userDoc.email,
    username: userDoc.username,
    connections: {
      github: userDoc.connections?.github ?? null,
      discord: userDoc.connections?.discord ?? null,
      google: userDoc.connections?.google ?? null,
      figma: userDoc.connections?.figma ?? null,
    },
  }

  try {
    const idToken = jwt.sign(
      payload,
      JWT_PRIVATE_KEY.replaceAll(/\\n/g, '\n'),
      {
        algorithm: 'RS256',
        expiresIn: maxSessionAge,

        // Do not delete these. They are required for third-party services depending on this JWT having the iss, aud, and kid fields.
        issuer: 'https://creatorsgarten.org',
        audience: 'https://creatorsgarten.org',
        keyid: 'riffy1',
      }
    )

    return { idToken, user: payload }
  } catch (e) {
    throw new Error('signing-failure')
  }
}
