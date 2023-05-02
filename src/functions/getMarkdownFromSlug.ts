import { contentsgarten } from '$constants/contentsgarten'
import { readFileSystem, writeFileSystem } from './fileSystem'
import hasha from 'hasha'

import type { ContentsgartenOutput } from '$types/ContentsgartenOutput'

type TRPCResponse = ContentsgartenOutput['view']
interface MarkdownResponse<T = Record<string, string>>
  extends Omit<TRPCResponse, 'frontMatter'> {
  frontMatter: T
}

export const getMarkdownFromSlug = async <Frontmatter = Record<string, string>>(
  slug: string
): Promise<MarkdownResponse<Frontmatter>> => {
  const cacheKey = ['wiki', slug]

  try {
    const cachedMarkdownResponse = await readFileSystem<
      MarkdownResponse<Frontmatter>
    >(cacheKey)

    if (cachedMarkdownResponse !== null) return cachedMarkdownResponse.data
    else throw new Error('cache-miss')
  } catch (e) {
    const fetchedMarkdownResponse = (await contentsgarten().view.query({
      pageRef: slug,
      withFile: true,
      revalidate: false,
      render: true,
    })) as MarkdownResponse<Frontmatter>

    if (fetchedMarkdownResponse.status === 200)
      await writeFileSystem(cacheKey, fetchedMarkdownResponse)

    return fetchedMarkdownResponse
  }
}

export function getContentHash(
  response: Pick<MarkdownResponse, 'content' | 'status'>
) {
  return [response.status, hasha(response.content, { algorithm: 'md5' })].join(
    '.'
  )
}
