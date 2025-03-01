import { getOembedInstance } from './getOembed'
import { getIframe } from './getIframe'

// Regex for matching code blocks to transform
const codeBlockRegex = /(<code>.+<\/code>)/

/**
 * Transform content by processing code blocks for embedded content
 */
export async function transformContent(content: string): Promise<string> {
  const getOembed = await getOembedInstance()
  
  const transformedChunks = await Promise.all(
    content.split(codeBlockRegex).map(async chunk => {
      return await transformChunk(chunk, getOembed)
    })
  )
  
  return transformedChunks.join('')
}

/**
 * Transform a single chunk of content
 */
async function transformChunk(chunk: string, getOembed: (url: string) => Promise<string>): Promise<string> {
  const matcher = chunk.match(/<code>(.+)<\/code>/)
  if (matcher === null) return chunk

  try {
    const matchedGroup = matcher[1].match(/^(\w+):(.+)/)
    if (matchedGroup === null) return chunk

    const [provider, value] = [matchedGroup[1], matchedGroup[2]].map(o =>
      o.trim()
    )

    switch (provider) {
      case 'oembed':
        return await getOembed(value)
      case 'youtube':
        return getIframe(`https://www.youtube.com/embed/${value}`)
      default:
        return chunk
    }
  } catch (e) {
    return chunk
  }
}