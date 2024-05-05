import { collections } from '$constants/mongo.ts'
import type { AuthenticatedUser } from '$types/AuthenticatedUser.ts'
import type { Handler } from 'elysia'

type Set = Parameters<Handler>[0]['set']

export async function saveDeviceAuthorization(
  user: AuthenticatedUser,
  deviceId: string,
  signature: string,
  set: Set
) {
  const userDoc = await collections.users.findOne({ uid: user.uid })
  if (!userDoc) {
    set.status = 500
    return 'User not found in database. This should not happen.'
  }

  const existingDeviceAuthorization =
    await collections.deviceAuthorizations.findOne({
      _id: deviceId,
    })
  if (existingDeviceAuthorization) {
    return { expiresAt: existingDeviceAuthorization.expiresAt }
  }

  const expiresAt = new Date(Date.now() + 10 * 60e3)
  await collections.deviceAuthorizations.insertOne({
    _id: deviceId,
    user: userDoc._id,
    signature,
    expiresAt,
  })

  return { expiresAt }
}
