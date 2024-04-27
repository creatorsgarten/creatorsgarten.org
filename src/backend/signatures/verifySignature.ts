import { createHmac } from 'crypto'
import { ObjectId } from 'mongodb'

export const verifySignature = async (
  signature: string
): Promise<
  | {
      verified: true
      messageHash: string
      userId: string
      timestamp: string
      nonce: string
    }
  | { verified: false; error: string }
> => {
  const parts = signature.split('_')
  const fail = (message: string) => ({
    verified: false as const,
    error: message,
  })
  if (parts[0] !== 'grtn') {
    return fail('Invalid signature format')
  }
  switch (parts[1]) {
    case 'v1': {
      const key = process.env.SIGN_KEY_01
      if (!key) {
        throw new Error('SIGN_KEY_01 is not set')
      }
      const [, , messageHash, userId, nonce, signatureHash] = parts
      const prefix = parts.slice(0, 5).join('_')
      const signature = createHmac('sha256', key)
        .update(prefix)
        .digest('hex')
        .slice(0, 24)
      if (signature !== signatureHash) {
        return fail('Signature mismatch')
      }
      return {
        verified: true,
        messageHash,
        userId,
        timestamp: new ObjectId(nonce).getTimestamp().toISOString(),
        nonce: nonce,
      }
    }
    default: {
      return fail('Invalid signature version')
    }
  }
}
