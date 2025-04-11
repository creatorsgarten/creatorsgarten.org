import jwt from 'jsonwebtoken'
import { JWT_PRIVATE_KEY } from 'astro:env/server'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'

export const getAuthenticatedUser = async (
  token?: string
): Promise<AuthenticatedUser | null> => {
  try {
    if (!token) return null

    const session = jwt.verify(token, JWT_PRIVATE_KEY) as AuthenticatedUser
    return session
  } catch (e) {
    return null
  }
}
