import { toBuffer } from 'qrcode'

import type { APIRoute } from 'astro'

export const get: APIRoute = async ctx => {
  console.log(ctx.url.searchParams.get('value'))
  return new Response(
    await toBuffer(
      ctx.url.searchParams.get('value') ?? 'https://youtu.be/dQw4w9WgXcQ',
      {
        errorCorrectionLevel: 'L',
        margin: 1,
        width: 768,
      }
    ),
    {
      headers: {
        'Content-Type': 'image/png',
      },
    }
  )
}
