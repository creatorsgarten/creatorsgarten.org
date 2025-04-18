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
    },
  }

  try {
    const idToken = jwt.sign(payload, JWT_PRIVATE_KEY, {
      algorithm: 'RS256',

      // https://openid.net/specs/openid-connect-basic-1_0.html#IDToken
      issuer: 'https://creatorsgarten.org',
      audience: 'https://creatorsgarten.org',
      expiresIn: maxSessionAge,

      header: {
        alg: 'RS256',
        kid: 'riffy1',
      },
    })
    return { idToken }
  } catch (e) {
    console.error('Error signing JWT:', e)
    throw new Error('unable-to-sign')
  }
}
