import type { AstroGlobal } from 'astro'
import { createHash, randomUUID } from 'crypto'

const uidMap = new WeakMap<any, string>()

export function prng(
  astro: Pick<AstroGlobal, 'request'>,
  key: string | string[]
) {
  let uid = uidMap.get(astro.request)
  if (!uid) {
    uid = randomUUID()
    uidMap.set(astro.request, uid)
  }
  const h = createHash('md5')
  h.update(uid)
  h.update(JSON.stringify(key))
  return parseInt(h.digest('hex').slice(0, 8), 16) / 0x100000000
}
