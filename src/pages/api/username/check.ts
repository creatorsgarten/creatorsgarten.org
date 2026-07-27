import { backendErrorMessage } from '$functions/getBackend'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url, locals }) => {
  const username = url.searchParams.get('username')

  if (!username) {
    return new Response(
      JSON.stringify({
        available: false,
        message: 'Username is required',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const { data: result, error: apiError } =
      await locals.backend.auth.checkUsernameAvailability.get({
        query: { username },
      })
    if (apiError) {
      throw new Error(backendErrorMessage(apiError, 'An error occurred'))
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error checking username availability:', error)
    return new Response(
      JSON.stringify({
        available: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
