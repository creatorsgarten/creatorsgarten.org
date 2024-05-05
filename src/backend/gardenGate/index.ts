import { Elysia } from 'elysia'
import { getBearer } from '../auth/getBearer.ts'
import { getAuthenticatedUser } from '../auth/getAuthenticatedUser.ts'
import { authenticatedHandler } from '../handler/authenticated.ts'
import { checkAccess } from './checkAccess.ts'
import { collections } from '$constants/mongo.ts'
import { createAccessQrCode } from './createAccessQrCode.ts'
import { pullLogs } from './pullLogs.ts'

export const gardenGate = new Elysia({
  name: 'gardenGate',
  prefix: '/gardenGate',
})
  .derive(({ headers }) => ({
    bearer: getBearer(headers['authorization']),
  }))
  .post(
    '/access',
    async ({ bearer, set }) => {
      const user = (await getAuthenticatedUser(bearer))!

      if (!(await checkAccess(user)).granted) {
        set.status = 400
        return 'You do not have permission.'
      }

      const userDoc = await collections.users.findOne({ uid: user.uid })
      if (!userDoc) {
        set.status = 500
        return 'User not found in database. This should not happen.'
      }

      return createAccessQrCode(user, userDoc, set)
    },
    {
      beforeHandle: authenticatedHandler,
    }
  )
  .get('/access', async ({ bearer }) =>
    checkAccess(await getAuthenticatedUser(bearer))
  )
  .get('/logs', pullLogs)
