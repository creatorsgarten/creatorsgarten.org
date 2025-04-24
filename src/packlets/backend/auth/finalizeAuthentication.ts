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
        issuer: 'https://creatorsgarten.org',
        audience: 'https://creatorsgarten.org',
        keyid: 'riffy1',
      }
    )

    return { idToken }
  } catch (e) {
    throw new Error('unable-to-sign-token')
  }
}
