import type { AstroGlobal } from 'astro'

export function getAuthTokenFromAstro(Astro: AstroGlobal) {
  return Astro.cookies.get('authgarten').value
}
