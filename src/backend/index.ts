import '@bogeychan/elysia-polyfills/node/index.js'

import { Elysia } from 'elysia'

import { auth } from './auth'
import { events } from './events'
import { signatures } from './signatures'
import { deviceAuthorization } from './deviceAuthorization'
import { gardenGate } from './gardenGate'

export const backend = new Elysia({
  name: 'backend',
  prefix: '/api/backend',
})
  .get('/about', () => 'creatorsgarten.org')
  .use(auth)
  .use(events)
  .use(signatures)
  .use(deviceAuthorization)
  .use(gardenGate)

export type Backend = typeof backend
