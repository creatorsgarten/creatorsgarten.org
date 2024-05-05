import type { Handler } from 'elysia'
import { getBearer } from '../auth/getBearer.ts'
import { getAuthenticatedUser } from '../auth/getAuthenticatedUser.ts'

type HandlerParams = Pick<Parameters<Handler>[0], 'headers' | 'set'>

export const authenticatedHandler = ({ headers, set }: HandlerParams) => {
  const bearer = getBearer(headers['authorization'])
  const user = getAuthenticatedUser(bearer)

  if (!user) {
    set.status = 401
    return 'User is not authenticated'
  }
}
