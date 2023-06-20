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
  }
}

export type GitHubConnection = {
  id: number
  username: string
} | null
