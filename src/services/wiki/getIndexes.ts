import { getStorage } from './getStorage'

interface Indexes {
  pages: Record<string, {
    name?: string
  }>
}

export const getIndexes = async () => {
  const file = await getStorage().readFile('index.json')

  if (!file)
    throw new Error(`Unable to find index.json`);

  return JSON.parse(file.content) as Indexes
}
