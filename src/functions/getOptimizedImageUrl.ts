import type { OptimizedImageOption } from '$types/OptimizedImageOption'

export const getOptimizedImageUrl = (
  url: string,
  options: OptimizedImageOption = {}
) => {
  const searchParams = new URLSearchParams({
    url,
  })

  if (options.format)
    searchParams.append('format', options.format)
  if (options.width)
    searchParams.append('w', options.width.toString())
  if (options.quality)
    searchParams.append('q', options.quality.toString())

  return `https://creatorsgarten.org/_urami?${searchParams.toString()}`
}
