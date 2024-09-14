import crypto from 'crypto'

export interface CloudinaryConfig {
  cloudName: string
  apiKey: string
  apiSecret: string
}

export function generateCloudinarySignature(
  inParams: Record<string, string>,
  config: CloudinaryConfig
): Record<string, string> {
  const params = { ...inParams }

  // Add timestamp to params
  const timestamp = Math.floor(Date.now() / 1000).toString()
  params.timestamp = timestamp

  // Remove excluded parameters
  delete params.file
  delete params.cloud_name
  delete params.resource_type
  delete params.api_key

  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc: Record<string, string>, key: string) => {
      acc[key] = params[key]
      return acc
    }, {})

  // Create the string to sign
  const stringToSign = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  // Append API secret
  const signatureString = stringToSign + config.apiSecret

  // Generate SHA-1 hash
  const signature = crypto
    .createHash('sha1')
    .update(signatureString)
    .digest('hex')

  // Return signature and timestamp
  return {
    ...inParams,
    timestamp,
    api_key: config.apiKey,
    signature,
  }
}
