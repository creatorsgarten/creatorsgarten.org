import type { DiscordConnection } from './mongo/User/DiscordConnection'
import type { GitHubConnection } from './mongo/User/GitHubConnection'
import type { BlueskyConnection } from './mongo/User/BlueskyConnection'

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
    bluesky: BlueskyConnection
  }
}
