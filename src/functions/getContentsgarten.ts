import { contentsgarten } from '$constants/contentsgarten'
import type { AstroGlobal } from 'astro'

/**
 * Get an authenticated contentsgarten instance using the user's auth token from cookies
 * 
 * @param astro Astro global object
 * @returns Contentsgarten client instance with authentication
 */
export function getContentsgarten(astro: AstroGlobal) {
  const authToken = astro.cookies.get('authgarten')?.value
  return contentsgarten(authToken)
} 