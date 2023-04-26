import fs from 'fs'
import path from 'path'

import { getHash } from './getHash'
import { contentApiBaseUrl } from '$constants/contentApiBaseUrl'

interface MarkdownResponse<Frontmatter = unknown> {
  result: {
    data: {
      status: 200
      pageRef: string
      title: string
      file: {
        path: string
        content: string
        revision: string
      }
      content: string
      rendered: {
        html: string
        headings: [
          {
            id: string
            label: string
            rank: number
          }
        ]
      }
      frontMatter: Frontmatter
      lastModified: string // ISO timestamp
      lastModifiedBy: string[]
    }
  }
}

const cacheDirectory = path.join(process.cwd(), '.cache')
const maxAge = 60 * 1000

export const getMarkdownFromSlug = async <Frontmatter = unknown>(
  slug: string
) => {
  // get file hash
  const now = Date.now()
  const cacheKey = getHash(['wiki', slug])
  const requestedDirectory = path.join(cacheDirectory, cacheKey)

  try {
    const files = await fs.promises.readdir(requestedDirectory)

    for (const file of files) {
      const [maxAgeString, expireAtString, etag, extension] = file.split('.')
      const filePath = path.join(requestedDirectory, file)
      const expireAt = Number(expireAtString)

      if (expireAt < now) {
        await fs.promises.rm(filePath)
      } else {
        const cachedMarkdownResponse = await fs.promises
          .readFile(path.join(requestedDirectory, file), 'utf8')
          .then(o => JSON.parse(o) as MarkdownResponse<Frontmatter>)

        return cachedMarkdownResponse.result.data
      }
    }

    throw new Error('cache-miss')
  } catch (e) {
    const fetchedMarkdownResponse = await fetch(
      `${contentApiBaseUrl}/api/contentsgarten/view?${new URLSearchParams(
        {
          input: JSON.stringify({
            pageRef: slug,
            withFile: true,
            revalidate: true,
            render: true,
          }),
        }
      ).toString()}`
    ).then(o => o.json() as Promise<MarkdownResponse<Frontmatter>>)

    console.log(fetchedMarkdownResponse.result.data.title, fetchedMarkdownResponse.result.data.status)
    if (fetchedMarkdownResponse.result.data.status === 200) {
      const targetFileName = `${maxAge}.${maxAge + Date.now()}.${getHash([
        JSON.stringify(fetchedMarkdownResponse),
      ])}.json`

      // any case of failure (maybe due to filesystem space ran out) can be ignored,
      // but it need to make sure it properly cleaned up
      try {
        await fs.promises.mkdir(requestedDirectory, { recursive: true })
        await fs.promises.writeFile(
          path.join(requestedDirectory, targetFileName),
          JSON.stringify(fetchedMarkdownResponse)
        )
      } catch (e) {
        await fs.promises
          .rm(path.join(requestedDirectory, targetFileName))
          .catch(() => {})
      }

      return fetchedMarkdownResponse.result.data
    } else {
      return null
    }
  }
}
