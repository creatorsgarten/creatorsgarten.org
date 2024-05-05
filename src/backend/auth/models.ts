import { t } from 'elysia'

export const auditInputSchema = t.Object({
  clientId: t.String(),
  redirectUri: t.String(),
  scopes: t.Array(t.String()),
})

export const mintIdTokenInputSchema = t.Object({
  audience: t.String(),
  nonce: t.Optional(t.String()),
  scopes: t.Array(t.String()),
})

export const authorizationCodeInputSchema = t.Object({
  code: t.String(),
})

export const deviceAuthorizationSignatureInputSchema = t.Object({
  deviceId: t.String(),
  signature: t.String(),
})
