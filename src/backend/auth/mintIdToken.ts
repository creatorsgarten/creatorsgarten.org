import jwt from 'jsonwebtoken'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { privateKey } from '$constants/secrets/privateKey'

/**
 * Data contained in ID token returned by Authgarten OIDC provider.
 * https://github.com/creatorsgarten/creatorsgarten.org/blob/main/src/backend/auth/mintIdToken.ts
 */
export interface AuthgartenOidcClaims {
  /** Unique user ID (24 characters hexadecimal) */
  sub: string

  /** Full name */
  name: string

  /** Avatar URL */
  picture: string

  /** Connections */
  connections: {
    github?: {
      /** GitHub user ID */
      id: number
      /** Username */
      username: string
    }
    eventpop: {
      /** Eventpop user ID */
      id: number
    }
  }
}

export function mintIdToken(user: AuthenticatedUser, audience: string): any {
  const id: AuthgartenOidcClaims = {
    sub: String(user.sub),
    name: user.name,
    picture: user.avatar,
    connections: {
      eventpop: { id: user.uid },
      github: user.connections.github ?? undefined,
    },
  }
  const idToken = jwt.sign(id, privateKey, {
    algorithm: 'RS256',

    // https://openid.net/specs/openid-connect-basic-1_0.html#IDToken
    issuer: 'https://creatorsgarten.org',
    audience: audience,
    expiresIn: 3600,

    header: {
      alg: 'RS256',
      kid: 'riffy1',
    },
  })
  return { idToken }
}
