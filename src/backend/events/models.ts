import { t } from 'elysia'

export const messageInputSchema = t.Object({
  message: t.String(),
})

export const signatureInputSchema = t.Object({
  signature: t.String(),
})
