export const contentApiBaseUrl =
  import.meta.env.CONTENT_API_URL ??
  process.env.CONTENT_API_URL ??
  'https://wiki.creatorsgarten.org'
