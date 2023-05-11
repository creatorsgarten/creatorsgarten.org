export function sample<T>(a: readonly T[]): T {
  return a[Math.floor(Math.random() * a.length)]
}
