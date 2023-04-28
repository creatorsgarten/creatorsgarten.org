import jwt from 'jsonwebtoken'

import { privateKey } from '$constants/secrets/privateKey'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import type { AstroGlobal } from 'astro'

export const getAuthenticatedUser = async (
  Astro: AstroGlobal
): Promise<AuthenticatedUser | null> => {
  try {
    const token = Astro.cookies.get('authgarten')

    const session = jwt.verify(
      token.value ?? '',
      privateKey
    ) as AuthenticatedUser

    return session
  } catch (e) {
    return null
  }
}
