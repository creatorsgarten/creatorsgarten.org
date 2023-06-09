import type { APIRoute } from 'astro'

export const get: APIRoute = async () => {
  // todo: plug with zero-trust to get card from backend, add fake delay for realism
  await new Promise(r => setTimeout(r, 3000))

  return {
    body: JSON.stringify({
      cardNo: `grtn-${Array.from({ length: 15 }).map(
        _ =>
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 100000) % 62]
      ).join('')}`,
      expireAt: new Date(new Date().valueOf() + 1000 * 60 * 3).toISOString(),
    }),
  }
}
