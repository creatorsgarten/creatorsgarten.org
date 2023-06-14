export const getWikiDescription = (html?: string) => {
  const matcher = (html ?? '').match(/<p[^>]*>(.+)<\/p>/)

  if (matcher === null) return undefined
  else
    return matcher[1].replace(
      /<\w[^>]*>([^<]+)<\/\w[^>]*>/g,
      chunk => chunk.match(/<\w[^>]*>([^<]+)<\/\w[^>]*>/)?.[1] ?? chunk
    )
}
