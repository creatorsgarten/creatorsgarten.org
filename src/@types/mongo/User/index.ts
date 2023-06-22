import type { Role } from '$types/Role'

import type { DiscordConnection } from './DiscordConnection'
import type { GitHubConnection } from './GitHubConnection'

export interface User {
  /** Eventpop user ID */
  uid: number
  name: string
  avatar: string
  email: string
  roles?: Role[]
  events: {
    id: number
    ticketId: number
    code: string
  }[]
  connections: {
    github?: GitHubConnection
    discord?: DiscordConnection
  }
  accessedAt: Date
}
