import { Elysia } from 'elysia'

import {
  auditInputSchema,
  authorizationCodeInputSchema,
  deviceAuthorizationSignatureInputSchema,
  mintIdTokenInputSchema,
} from './models'

import { getAuthenticatedUser } from './getAuthenticatedUser'
import { checkOAuthAudit, recordOAuthAudit } from './oAuthAudit'
import { mintIdToken } from './mintIdToken.ts'
import { authenticateEventpopUser } from './authenticateEventpopUser.ts'
import { authenticateDeviceAuthorizationSignature } from './authenticateDeviceAuthorizationSignature.ts'
import { authenticateGitHub } from './authenticateGitHub.ts'
import { authenticateDiscord } from './authenticateDiscord.ts'
import { createPrivateKey, createPublicKey } from 'crypto'
import { privateKey } from '$constants/secrets/privateKey.ts'
import { exportJWK } from 'jose'
import { getBearer } from './getBearer.ts'
import { authenticatedHandler } from '../handler/authenticated.ts'

export const auth = new Elysia({
  name: 'auth',
  prefix: '/auth',
})
  .derive(({ headers }) => ({
    bearer: getBearer(headers['authorization']),
  }))
  .get('/user', ({ bearer }) => getAuthenticatedUser(bearer))

  // OAuth
  .get('/oauth/check', ({ bearer, body }) => checkOAuthAudit(bearer, body), {
    beforeHandle: authenticatedHandler,
    body: auditInputSchema,
  })
  .post('/oauth/record', ({ bearer, body }) => recordOAuthAudit(bearer, body), {
    beforeHandle: authenticatedHandler,
    body: auditInputSchema,
  })

  // Handler to mint ID token
  .post(
    '/mintIdToken',
    async ({ bearer, body }) =>
      mintIdToken((await getAuthenticatedUser(bearer))!, body),
    {
      beforeHandle: authenticatedHandler,
      body: mintIdTokenInputSchema,
    }
  )

  // Sign-in handler
  .post(
    '/signIn/eventpopAuthorizationCode',
    ({ body }) => authenticateEventpopUser(body.code),
    {
      body: authorizationCodeInputSchema,
    }
  )
  .post(
    '/signIn/deviceAuthorizationSignature',
    ({ body, set }) =>
      authenticateDeviceAuthorizationSignature(
        body.deviceId,
        body.signature,
        set
      ),
    {
      body: deviceAuthorizationSignatureInputSchema,
    }
  )

  // Account linking
  .post(
    '/link/github',
    ({ bearer, body }) => authenticateGitHub(body.code, bearer),
    {
      body: authorizationCodeInputSchema,
    }
  )
  .post(
    '/link/discord',
    ({ bearer, body }) => authenticateDiscord(body.code, bearer),
    {
      body: authorizationCodeInputSchema,
    }
  )

  // JWKs
  .get('/publicKeys', async () => {
    const privateKeyObj = createPrivateKey(privateKey)
    const publicKeyObj = createPublicKey(privateKeyObj)
    return [{ ...(await exportJWK(publicKeyObj)), kid: 'riffy1' }]
  })
