import type { WithId } from 'mongodb'
import type { Role } from '$types/Role'

export type User = WithId<{
  /** Eventpop user ID */
  uid: number
  name: string
  avatar: string
  email: string
  roles?: Role[]
  events: {
    id: number
    code: string
  }[]
  connections: {
    github: {
      id: number
      username: string
    } | null
  }
  accessedAt: Date
}>
