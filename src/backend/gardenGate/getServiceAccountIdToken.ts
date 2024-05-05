import { readFileSystem, writeFileSystem } from '$functions/fileSystem.ts'
import { GoogleAuth } from 'google-auth-library'

export const getServiceAccountIdToken = async (audience: string) => {
  const cachedToken = await readFileSystem<string>(['googleIdToken', audience])

  if (cachedToken !== null) return cachedToken.data

  const auth = new GoogleAuth()
  const client = await auth.getClient()
  if (!('fetchIdToken' in client)) throw new Error('No fetchIdToken')

  // each token has 1 hour life
  const token = await client.fetchIdToken(audience)

  // allow to cache token for 30 minutes, preventing spaming to google cloud
  await writeFileSystem(['googleIdToken', audience], token, 30 * 60 * 1000)
  return token
}
