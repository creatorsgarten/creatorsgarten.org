import type { DiscordConnection } from './mongo/User/DiscordConnection'
import type { FigmaConnection } from './mongo/User/FigmaConnection'
import type { GitHubConnection } from './mongo/User/GitHubConnection'
import type { GoogleConnection } from './mongo/User/GoogleConnection'

export interface AuthenticatedUser {
  /** ID in the database */
  sub: string

  /** Eventpop user ID */
  uid: number

  name: string
  avatar: string
  email: string

  connections: {
    github: GitHubConnection
    discord: DiscordConnection
    google: GoogleConnection
    figma: FigmaConnection
  }
}
