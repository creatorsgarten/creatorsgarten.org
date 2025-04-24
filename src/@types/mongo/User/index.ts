import type { Role } from '$types/Role'

import type { DiscordConnection } from './DiscordConnection'
import type { EventTicket } from './EventTicket'
import type { FigmaConnection } from './FigmaConnection'
import type { GitHubConnection } from './GitHubConnection'
import type { GoogleConnection } from './GoogleConnection'

export interface User {
  /** Eventpop user ID */
  uid: number
  name: string
  avatar: string
  email: string
  roles?: Role[]
  events: EventTicket[]
  connections: {
    github?: GitHubConnection
    discord?: DiscordConnection
    google?: GoogleConnection
    figma?: FigmaConnection
  }
  accessedAt: Date
  /** Unique username for the user profile */
  username?: string
}
