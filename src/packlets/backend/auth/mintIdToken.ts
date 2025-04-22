import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import type { DiscordConnection } from '$types/mongo/User/DiscordConnection'
import type { GitHubConnection } from '$types/mongo/User/GitHubConnection'
import { JWT_PRIVATE_KEY } from 'astro:env/server'
import jwt from 'jsonwebtoken'
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
    eventpop: {
      /** Eventpop user ID */
      id: number
    }
    github?: GitHubConnection
    discord?: DiscordConnection
  }

  /** Associated Eventpop tickets */
  eventpopTickets?: {
    /** Event ID */
    eventId: number

    /** Ticket ID */
    ticketId: number

    /** Reference code */
    refCode: string

    /** Ticket holder's first name */
    firstName: string

    /** Ticket holder's last name */
    lastName: string

    /** Ticket holder's email address */
    email: string

    /** Ticket type */
    ticketType: {
      /** Ticket type ID */
      id: number
      /** Ticket type name */
      name: string
    }
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
    picture: user.avatar?.includes('://')
      ? user.avatar
      : 'https://api.dicebear.com/6.x/thumbs/svg?seed=' + user.sub,
    connections: {
      eventpop: { id: user.uid },
      github: user.connections.github,
      discord: user.connections.discord,
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
        ticketType: event.ticketType,
        firstName: event.firstName,
        lastName: event.lastName,
        email: event.email,
      }))
  }

  const idToken = jwt.sign(claims, JWT_PRIVATE_KEY.replaceAll(/\\n/g, '\n'), {
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
