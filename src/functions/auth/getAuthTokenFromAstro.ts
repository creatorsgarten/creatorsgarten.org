import type { AstroGlobal } from 'astro'

export function getAuthTokenFromAstro(Astro: Pick<AstroGlobal, 'cookies'>) {
  return Astro.cookies.get('authgarten').value
}
