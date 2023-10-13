import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData()
  const result = JSON.parse(data.get('code') as string)
  return new Response(JSON.stringify(result), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
