import type { ObjectId } from 'mongodb'

export type OAuthAudit = {
  clientId: string
  redirectUri: string
  user: ObjectId
  scopes: string[]
  authorizedAt: Date
}
