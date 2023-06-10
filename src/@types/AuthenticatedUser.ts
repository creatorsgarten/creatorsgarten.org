export interface AuthenticatedUser {
  /** ID in the database */
  sub: string

  /** Eventpop user ID */
  uid: number

  name: string
  avatar: string
  email: string
  events: number[]
  connections: {
    github: {
      id: number
      username: string
    } | null
  }
}
