import type { AstroGlobal } from 'astro'
import { createHash, randomUUID } from 'crypto'
import { getFeatureFlags } from './getFeatureFlags'

const uidMap = new WeakMap<any, string>()

export function prng(
  astro: Pick<AstroGlobal, 'url'>,
  key: string | (string | number)[]
) {
  let base =
    astro.url.searchParams.get('seed') ||
    (() => {
      if (getFeatureFlags(astro).isEnabled('og:image')) {
        return astro.url.pathname
      }
    })() ||
    (() => {
      let uid = uidMap.get(astro.url)
      if (!uid) {
        uid = randomUUID()
        uidMap.set(astro.url, uid)
      }
      return uid
    })()
  const h = createHash('md5')
  h.update(base)
  h.update(JSON.stringify(key))
  return parseInt(h.digest('hex').slice(0, 8), 16) / 0x100000000
}
