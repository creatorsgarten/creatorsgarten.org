import jwt from 'jsonwebtoken'

import { privateKey } from '$constants/secrets/privateKey.ts'

import type { AuthenticatedUser } from '$types/AuthenticatedUser.ts'

export const getAuthenticatedUser = async (
  token?: string
): Promise<AuthenticatedUser | null> => {
  try {
    if (!token) return null

    const session = jwt.verify(token, privateKey) as AuthenticatedUser
    return session
  } catch (e) {
    return null
  }
}
