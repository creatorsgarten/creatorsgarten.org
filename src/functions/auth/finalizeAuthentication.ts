import jwt from 'jsonwebtoken'

import { mongo } from '$constants/mongo'
import { maxSessionAge } from '$constants/maxSessionAge'
import { privateKey } from '$constants/secrets/privateKey'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import type { AstroGlobal } from 'astro'

export const finalizeAuthentication = async (
  uid: number,
  Astro: AstroGlobal
) => {
  // get mongo document
  const userDoc = await mongo
    .db('creatorsgarten-org')
    .collection('users')
    .findOne({ uid })

  if (userDoc === null) throw new Error('unsuccessful-authentication')

  const payload: AuthenticatedUser = {
    uid: userDoc.uid,
    name: userDoc.name,
    avatar: userDoc.avatar,
    email: userDoc.email,
    connections: {
      github: userDoc.connections?.github ?? null,
    },
  }

  try {
    const sealedToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      issuer: 'creatorsgarten',
      expiresIn: maxSessionAge,
      header: {
        alg: 'RS256',
        kid: 'riffy1'
      }
    })

    Astro.cookies.set('authgarten', sealedToken, {
      maxAge: 60 * 60 * 12, // 12 hours
      httpOnly: true,
      secure: import.meta.env.PROD,
      path: '/',
      sameSite: 'lax',
    })
  } catch (e) {
    throw new Error('unable-to-sign')
  }
}
