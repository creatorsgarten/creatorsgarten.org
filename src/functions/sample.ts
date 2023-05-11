export function sample<T>(a: readonly T[], rand = Math.random()): T {
  return a[Math.floor(rand * a.length)]
}
