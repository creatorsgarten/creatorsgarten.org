import type { WithId } from "mongodb"

export type User =  WithId<{
  /** Eventpop user ID */
  uid: number
  name: string
  avatar: string
  email: string
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
