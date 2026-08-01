import type { OptimizedImageOption } from '$types/OptimizedImageOption'

export const getOptimizedImageUrl = (
  url: string,
  options: OptimizedImageOption = {}
) => {
  const searchParams = new URLSearchParams({
    url,
  })

  if (options.format) searchParams.append('format', options.format)
  if (options.width) searchParams.append('w', options.width.toString())
  // @urami/core parses the `q` param as `Number(searchParams.get('q') ?? '')`,
  // which is `0` (not a sane default) when `q` is omitted -- Sharp then
  // rejects `quality: 0` outright. Always send an explicit value so we never
  // depend on that broken default.
  searchParams.append('q', (options.quality ?? 80).toString())

  return `https://creatorsgarten.org/_urami?${searchParams.toString()}`
}
