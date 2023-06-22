import jwt from 'jsonwebtoken'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { privateKey } from '$constants/secrets/privateKey'
import { getJoinedEvents } from '../events/getJoinedEvents'

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

  /** Email (requires `email` scope) */
  email?: string

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

  /** Associated Eventpop tickets */
  eventpopTickets?: {
    /** Event ID */
    eventId: number

    /** Ticket ID */
    ticketId: number

    /** Reference code */
    refCode: string
  }[]

  /** The nonce value, per https://openid.net/specs/openid-connect-core-1_0.html#IDToken */
  nonce?: string
}

export async function mintIdToken(
  user: AuthenticatedUser,
  audience: string,
  nonce: string | undefined,
  scopes: string[]
): Promise<{ idToken: string; claims: AuthgartenOidcClaims }> {
  const claims: AuthgartenOidcClaims = {
    sub: String(user.sub),
    name: user.name,
    picture: user.avatar,
    connections: {
      eventpop: { id: user.uid },
      github: user.connections.github ?? undefined,
    },
    nonce,
  }

  if (scopes.includes('email')) {
    claims.email = user.email
  }

  const eventpopEventRegex = /^https:\/\/eventpop\.me\/e\/(\d+)$/
  const eventIds = new Set<number>()
  for (const scope of scopes) {
    const match = eventpopEventRegex.exec(scope)
    if (match) {
      eventIds.add(Number(match[1]))
    }
  }
  if (eventIds.size > 0) {
    const joinedEvents = await getJoinedEvents(user)
    claims.eventpopTickets = joinedEvents
      .filter(event => eventIds.has(event.id))
      .map(event => ({
        eventId: event.id,
        ticketId: event.ticketId,
        refCode: event.code,
      }))
  }

  const idToken = jwt.sign(claims, privateKey, {
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
  return { idToken, claims }
}
