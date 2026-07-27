import { treaty } from '@elysiajs/eden'
import { describe, expect, it, vi } from 'vitest'

vi.mock('astro:env/server', () => ({
  JWT_PRIVATE_KEY: undefined,
  MONGO_ADDRESS: 'mongodb://localhost:27017/test',
}))

const { app } = await import('./index')
const client = treaty(app)

describe('backend Elysia app', () => {
  it('about: happy path, no auth needed', async () => {
    const { data, error } = await client.about.get()
    expect(error).toBeNull()
    expect(data).toBe('creatorsgarten.org')
  })

  it('auth.getAuthenticatedUser: unauthenticated returns null, not an error', async () => {
    const { data, error } = await client.auth.getAuthenticatedUser.get()
    expect(error).toBeNull()
    expect(data).toBeNull()
  })

  it('auth.mintIdToken: unauthenticated -> 401', async () => {
    const { data, error } = await client.auth.mintIdToken.post({
      audience: 'test-client',
      scopes: [],
    })
    expect(data).toBeNull()
    expect(error?.status).toBe(401)
  })

  it('auth.mintIdToken: missing required field -> 422 validation error', async () => {
    const { data, error } = await client.auth.mintIdToken.post({
      audience: 'test-client',
    } as never)
    expect(data).toBeNull()
    expect(error?.status).toBe(422)
  })

  it('signatures.verifySignature: happy path, no auth/db needed', async () => {
    const { data, error } = await client.signatures.verifySignature.get({
      query: { signature: 'not-a-valid-signature' },
    })
    expect(error).toBeNull()
    expect(data).toEqual({
      verified: false,
      error: 'Invalid signature format',
    })
  })

  it('gardenGate.checkAccess: unauthenticated happy path', async () => {
    const { data, error } = await client.gardenGate.checkAccess.get()
    expect(error).toBeNull()
    expect(data).toEqual({
      granted: false,
      reason: 'You are not logged in.',
    })
  })

  it('events.getJoinedEvents: TRPCError thrown by a service function still maps to 401 via onError', async () => {
    const { data, error } = await client.events.getJoinedEvents.get()
    expect(data).toBeNull()
    expect(error?.status).toBe(401)
  })
})
