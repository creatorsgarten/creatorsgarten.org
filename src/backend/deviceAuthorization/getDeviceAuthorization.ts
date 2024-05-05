import { collections } from '$constants/mongo.ts'
import { sha256 } from '$functions/sha256.ts'

export async function getDeviceAuthorization(
  deviceIdBasis: string
): Promise<{ found: false } | { found: true; signature: string }> {
  const deviceAuthorization = await collections.deviceAuthorizations.findOne({
    _id: await sha256(deviceIdBasis),
    expiresAt: { $gt: new Date() },
  })
  if (!deviceAuthorization) {
    return {
      found: false,
    }
  }
  return {
    found: true,
    signature: deviceAuthorization.signature,
  }
}
