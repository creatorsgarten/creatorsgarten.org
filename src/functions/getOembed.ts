import { OembedProvider } from '$types/OembedProvider'
import { OembedResult } from '$types/OembedResult'
import { readFileSystem, writeFileSystem } from './fileSystem'

const getProviders = async () => {
  const cachedProviders = await readFileSystem<OembedProvider[]>([
    'oembed',
    'providers',
  ])

  if (cachedProviders !== null) return cachedProviders.data

  const fetchedProviders = await fetch(
    'https://oembed.com/providers.json'
  ).then(o => o.json() as Promise<OembedProvider[]>)

  await writeFileSystem(
    ['oembed', 'providers'],
    fetchedProviders,
    1000 * 60 * 60 * 24 * 30 // 1 month
    )

  return fetchedProviders
}

const getProviderEndpoint = (url: string, providers: OembedProvider[]) => {
  let transformedEndpoint = undefined

  for (const provider of providers || []) {
    for (const endpoint of provider.endpoints || []) {
      for (let schema of endpoint.schemes || []) {
        if (transformedEndpoint === undefined) {
          schema = schema.replace('*', '.*')
          const regExp = new RegExp(schema)
          const isMatchingSchema = regExp.test(url)

          if (isMatchingSchema) {
            transformedEndpoint = endpoint.url
          }
        }
      }
    }
  }

  return transformedEndpoint
}

export const getOembedInstance = async () => {
  const oembedProviders = await getProviders()

  return async (url: string) => {
    const cacheKey = ['oembed', 'endpoints', url]

    const cachedOembedResult = await readFileSystem<OembedResult>(cacheKey)

    if (cachedOembedResult !== null) return cachedOembedResult.data.html

    const endpoint = getProviderEndpoint(url, oembedProviders)
    const oembedResult = await fetch(
      `${endpoint}?${new URLSearchParams({
        format: 'json',
        url: url,
      }).toString()}`
    ).then(o => {
      if (o.ok) return o.json() as Promise<OembedResult>
      else throw o
    })

    await writeFileSystem(
      cacheKey,
      oembedResult,
      1000 * 60 * 60 * 24 * 7 // 7 days
    )

    return oembedResult.html
  }
}
