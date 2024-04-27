import type { ObjectId } from 'mongodb'

export type DeviceAuthorization = {
  _id: string
  user: ObjectId
  signature: string
  expiresAt: Date
}
