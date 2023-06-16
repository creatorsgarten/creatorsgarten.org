import type { ObjectId } from 'mongodb'

export type GardenAccess = {
  user: ObjectId
  accessKey: string | null
  requestedAt: Date
  createdAt: Date | null
  expiresAt: Date | null
  usedAt: Record<string, Date>
  notifiedAt: Record<string, Date>
}
