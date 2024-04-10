import type { APIRoute } from 'astro'
import { createHmac } from 'crypto'
import { ObjectId } from 'mongodb'

export const GET: APIRoute = async Astro => {
  const signature = String(Astro.url.searchParams.get('signature') || '')
  const parts = signature.split('_')

  const fail = (message: string) =>
    new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
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
      const result = {
        verified: true,
        messageHash,
        userId,
        timestamp: new ObjectId(nonce).getTimestamp().toISOString(),
        nonce: nonce,
      }
      return new Response(JSON.stringify(result), {
        headers: { 'content-type': 'application/json' },
      })
    }
    default: {
      return fail('Invalid signature version')
    }
  }
}
