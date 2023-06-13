import fs from 'fs'

import type { APIRoute } from 'astro'

export const get: APIRoute = async ctx => {
  const targetPath = ctx.url.searchParams.get('value')

  console.log(await fs.promises.readFile(targetPath ?? '', 'utf-8'))

  return new Response('ok')
}
