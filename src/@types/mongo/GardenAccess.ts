import type { ObjectId, WithId } from 'mongodb'

export type GardenAccess =  WithId<{
  user: ObjectId
  accessKey: string | null
  requestedAt: Date
  createdAt: Date | null
  expiresAt: Date | null
  usedAt: Record<string, Date>
  notifiedAt: Record<string, Date>
}>
