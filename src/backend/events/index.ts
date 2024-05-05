import { Elysia } from 'elysia'
import { authenticatedHandler } from '../handler/authenticated.ts'
import { getJoinedEvents } from './getJoinedEvents.ts'
import { getAuthenticatedUser } from '../auth/getAuthenticatedUser.ts'
import { getBearer } from '../auth/getBearer.ts'

export const events = new Elysia({
  name: 'events',
  prefix: '/events',
})
  .derive(({ headers }) => ({
    bearer: getBearer(headers['authorization']),
  }))
  .get(
    '/joined',
    async ({ bearer }) =>
      getJoinedEvents((await getAuthenticatedUser(bearer))!),
    {
      beforeHandle: authenticatedHandler,
    }
  )
