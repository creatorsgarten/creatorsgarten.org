import { getOptimizedImageUrl } from '$functions/getOptimizedImageUrl'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params, locals }) => {
  // Get user ID from params
  const id = params.id

  if (!id) {
    // Redirect to a default DiceBear image if no userId
    return redirectToDiceBear('unknown')
  }

  try {
    // Use the backend tRPC client to get the profile picture URL
    const profile = await locals.backend.users.getPublicProfile.query(
      id.startsWith('@') ? { username: id.slice(1) } : { userId: id }
    )
    const pictureUrl = profile.profilePictureUrl

    // Validate if the URL is valid and starts with https://
    if (pictureUrl && isValidImageUrl(pictureUrl)) {
      const optimizedPictureUrl = getOptimizedImageUrl(pictureUrl, {
        width: 192,
        height: 192,
        format: 'webp',
      })
      // Redirect to the picture URL
      return new Response(null, {
        status: 302,
        headers: {
          Location: optimizedPictureUrl,
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      })
    } else {
      // If URL is invalid, redirect to DiceBear
      return redirectToDiceBear(id)
    }
  } catch (error: any) {
    // For any error, redirect to DiceBear instead of showing an error
    console.error('Error getting profile picture:', error)
    return redirectToDiceBear(id)
  }
}

// Function to create a redirect response to DiceBear
function redirectToDiceBear(seed: string): Response {
  const diceBearUrl = `https://api.dicebear.com/6.x/pixel-art-neutral/svg?seed=${encodeURIComponent(seed)}`

  return new Response(null, {
    status: 302,
    headers: {
      Location: diceBearUrl,
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
}

// Function to validate an image URL
function isValidImageUrl(url: string): boolean {
  try {
    // Check if it's a valid URL
    new URL(url)

    // Ensure it starts with https://
    // You can add additional checks here if needed
    return url.startsWith('https://')
  } catch {
    return false
  }
}
