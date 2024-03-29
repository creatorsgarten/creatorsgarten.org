import { toBuffer } from 'qrcode'

import type { APIRoute } from 'astro'

export const GET: APIRoute = async ctx => {
  return new Response(
    await toBuffer(
      ctx.url.searchParams.get('value') ?? 'https://youtu.be/dQw4w9WgXcQ',
      {
        errorCorrectionLevel: 'L',
        margin: 2,
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
