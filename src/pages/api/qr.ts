import { toBuffer } from 'qrcode'

import type { APIRoute } from 'astro'

export const get: APIRoute = async ctx => {
  if (ctx.locals.user === null)
    return new Response('forbidden', {
      status: 403,
    })

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
