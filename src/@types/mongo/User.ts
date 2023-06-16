import type { Role } from '$types/Role'

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
    github: {
      id: number
      username: string
    } | null
  }
  accessedAt: Date
}
