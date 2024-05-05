import { Elysia } from 'elysia'
import { messageInputSchema, signatureInputSchema } from '../events/models.ts'
import { authenticatedHandler } from '../handler/authenticated.ts'
import { getBearer } from '../auth/getBearer.ts'
import { generateSignature } from './generateSignature.ts'
import { getAuthenticatedUser } from '../auth/getAuthenticatedUser.ts'
import { verifySignature } from './verifySignature.ts'

export const signatures = new Elysia({
  name: 'signatures',
  prefix: '/signatures',
})
  .derive(({ headers }) => ({
    bearer: getBearer(headers['authorization']),
  }))
  .post(
    '/create',
    async ({ bearer, body }) =>
      generateSignature((await getAuthenticatedUser(bearer))!, body.message),
    {
      beforeHandle: authenticatedHandler,
      body: messageInputSchema,
    }
  )
  .get('/verify', async ({ body }) => verifySignature(body.signature), {
    body: signatureInputSchema,
  })
