import Iron from '@hapi/iron'

import type { AuthenticatedUser } from "$types/AuthenticatedUser";
import type { AstroGlobal } from "astro";

export const getAuthenticatedUser = async (Astro: AstroGlobal): Promise<AuthenticatedUser | null> => {
  try {
    const token = Astro.cookies.get('authgarten')

    const session = await Iron.unseal(token.value ?? '', import.meta.env.IRON_SECRET, Iron.defaults)
    const expiresAt = session.createdAt + session.maxAge * 1000

    // Validate the expiration date of the session
    if (Date.now() > expiresAt) {
      // throw new Error('session-expired')
      return null
    }

    return session
  } catch (e) {
    return null
  }
}
