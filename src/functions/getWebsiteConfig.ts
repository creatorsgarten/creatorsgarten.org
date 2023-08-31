import { contentsgarten } from '$constants/contentsgarten'
import { websiteConfigSchema } from '$constants/websiteConfigSchema'
import { readFileSystem, writeFileSystem } from './fileSystem'
import { type FrontMatter, parseFrontMatter } from './parseFrontMatter'

export type WebsiteConfig = NonNullable<FrontMatter['websiteConfig']>

export const getWebsiteConfig = async (): Promise<WebsiteConfig | null> => {
  const cachedConfig = await readFileSystem<WebsiteConfig>(['websiteConfig'])

  if (cachedConfig !== null) {
    const parsed = websiteConfigSchema.safeParse(cachedConfig.data)
    if (parsed.success) {
      return parsed.data
    }
  }

  const searchResults = (
    await contentsgarten().search.query({
      pageRef: 'WebsiteConfig',
    })
  ).results

  if (searchResults.length === 0) {
    console.warn('WebsiteConfig not found')
    return null
  }

  const page = searchResults[0]
  const parsed = parseFrontMatter(page.frontMatter)
  if (!parsed.success) {
    console.warn('WebsiteConfig invalid', parsed.error)
    return null
  }
  if (!parsed.data.websiteConfig) {
    console.warn('WebsiteConfig not found in front matter')
    return null
  }

  await writeFileSystem(
    ['websiteConfig'],
    parsed.data.websiteConfig,
    1000 * 60 * 1 // 1 minute
  )

  return parsed.data.websiteConfig
}
