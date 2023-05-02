import fs from 'fs'
import path from 'path'
import { createHash } from 'crypto'

const cacheDirectory = path.join(process.cwd(), '.cache')

export const getHash = (
  items: (string | number | Buffer)[],
  algorithm = 'sha256'
) => {
  const hash = createHash(algorithm)
  for (let item of items) {
    if (typeof item === 'number') hash.update(String(item))
    else {
      hash.update(item)
    }
  }
  // See https://en.wikipedia.org/wiki/Base64#Filenames
  return hash.digest('base64').replace(/\//g, '-')
}

export const purgeFileSystem = async (key: string[]) => {
  const hash = getHash(key)
  const requestedDirectory = path.join(cacheDirectory, hash)

  try {
    await fs.promises.rm(requestedDirectory, {
      recursive: true,
    })
  } catch (e) {}
}

export const readFileSystem = async <T = unknown>(key: string[]) => {
  const hash = getHash(key)
  const requestedDirectory = path.join(cacheDirectory, hash)

  try {
    const now = Date.now()
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
          .then(o => JSON.parse(o) as T)

        return {
          etag,
          data: cachedMarkdownResponse,
        }
      }
    }
  } catch (e) {}
  return null
}

export const writeFileSystem = async (
  key: string[],
  content: unknown,
  maxAge = 60 * 1000
) => {
  const stringifiedContent = JSON.stringify(content)

  const hash = getHash(key)
  const etag = getHash([stringifiedContent])
  const requestedDirectory = path.join(cacheDirectory, hash)
  const targetFileName = `${maxAge}.${maxAge + Date.now()}.${etag}.json`

  try {
    await fs.promises.mkdir(requestedDirectory, { recursive: true })
    await fs.promises.writeFile(
      path.join(requestedDirectory, targetFileName),
      stringifiedContent
    )

    return {
      etag,
      data: content,
    }
  } catch (e) {
    console.log(`failed to write [${key.join(', ')}] to filesystem`)
    await fs.promises
      .rm(path.join(requestedDirectory, targetFileName))
      .catch(() => {})
  }
}
