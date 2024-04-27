import { collections } from '$constants/mongo'

export async function getDeviceAuthorization(
  deviceId: string
): Promise<{ found: false } | { found: true; signature: string }> {
  const deviceAuthorization = await collections.deviceAuthorizations.findOne({
    _id: deviceId,
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
