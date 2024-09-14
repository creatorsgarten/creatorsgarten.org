import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { createHash, createHmac } from 'crypto'
import { ObjectId } from 'mongodb'

export const generateMessageHash = (msg: string) => {
  return createHash('sha256').update(msg).digest('hex').slice(0, 24)
}

export const generateSignature = (user: AuthenticatedUser, msg: string) => {
  const key = process.env.SIGN_KEY_01
  if (!key) {
    throw new Error('SIGN_KEY_01 is not set')
  }
  const messageHash = generateMessageHash(msg)
  const prefix = [
    'grtn',
    'v1',
    messageHash,
    user.sub,
    new ObjectId().toString(),
  ].join('_')
  const signature = createHmac('sha256', key)
    .update(prefix)
    .digest('hex')
    .slice(0, 24)
  return { signature: `${prefix}_${signature}`, messageHash }
}
