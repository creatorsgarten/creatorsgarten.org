import jwt from 'jsonwebtoken'

import { mongo } from '$constants/mongo'
import { maxSessionAge } from '$constants/maxSessionAge'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import type { AstroGlobal } from 'astro'
import { privateKey } from '$constants/secrets/privateKey'

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
      github: userDoc.connections?.github
        ? {
            username: userDoc.connections.github.username,
          }
        : null,
    },
  }

  try {
    const sealedToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      issuer: 'creatorsgarten',
      expiresIn: maxSessionAge,
    })

    Astro.cookies.set('authgarten', sealedToken, {
      maxAge: 60 * 60 * 12, // 12 hours
      httpOnly: true,
      secure: import.meta.env.PROD,
      path: '/',
      sameSite: 'lax',
    })
  } catch (e) {
    console.error(e)
  }
}
