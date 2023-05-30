import jwt from 'jsonwebtoken'

import { mongo } from '$constants/mongo'
import { maxSessionAge } from '$constants/maxSessionAge'
import { privateKey } from '$constants/secrets/privateKey'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'

export const finalizeAuthentication = async (uid: number) => {
  // get mongo document
  const userDoc = await mongo
    .db('creatorsgarten-org')
    .collection('users')
    .findOne({ uid })

  if (userDoc === null) throw new Error('unsuccessful-authentication')

  const payload: AuthenticatedUser = {
    sub: String(userDoc._id),
    uid: userDoc.uid,
    name: userDoc.name,
    avatar: userDoc.avatar,
    email: userDoc.email,
    connections: {
      github: userDoc.connections?.github ?? null,
    },
  }

  try {
    const idToken = jwt.sign(payload, privateKey, {
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
    throw new Error('unable-to-sign')
  }
}
