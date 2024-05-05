import { Elysia } from 'elysia'
import { getInputSchema, saveInputSchema } from './models.ts'
import { saveDeviceAuthorization } from './saveDeviceAuthorization.ts'
import { getAuthenticatedUser } from '../auth/getAuthenticatedUser.ts'
import { getBearer } from '../auth/getBearer.ts'
import { getDeviceAuthorization } from './getDeviceAuthorization.ts'

export const deviceAuthorization = new Elysia({
  name: 'deviceAuthorization',
  prefix: '/deviceAuthorization',
})
  .derive(({ headers }) => ({
    bearer: getBearer(headers['authorization']),
  }))
  .get('/', ({ body }) => getDeviceAuthorization(body.deviceIdBasis), {
    body: getInputSchema,
  })
  .post(
    '/',
    async ({ bearer, body, set }) =>
      saveDeviceAuthorization(
        (await getAuthenticatedUser(bearer))!,
        body.deviceId,
        body.signature,
        set
      ),
    {
      body: saveInputSchema,
    }
  )
