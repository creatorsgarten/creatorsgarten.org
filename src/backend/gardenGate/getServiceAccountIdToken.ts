import fs from 'fs/promises'
import { readFileSystem, writeFileSystem } from '$functions/fileSystem'
import { auth } from 'google-auth-library'

export const getServiceAccountIdToken = async (
  audience: string,
  credentialPath: string
) => {
  const cachedToken = await readFileSystem<string>(['googleIdToken', audience])

  if (cachedToken !== null) return cachedToken.data

  const client = auth.fromJSON(
    JSON.parse(await fs.readFile(credentialPath, 'utf8'))
  )
  if (!('fetchIdToken' in client)) throw new Error('No fetchIdToken')

  // each token has a lifespan of 1 hour
  const token = await client.fetchIdToken(audience)

  // allow caching token for 30 minutes, preventing spaming to google cloud
  await writeFileSystem(['googleIdToken', audience], token, 30 * 60 * 1000)
  return token
}
