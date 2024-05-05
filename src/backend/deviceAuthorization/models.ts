import { t } from 'elysia'

export const getInputSchema = t.Object({
  deviceIdBasis: t.String(),
})

export const saveInputSchema = t.Object({
  deviceId: t.String(),
  signature: t.String(),
})
