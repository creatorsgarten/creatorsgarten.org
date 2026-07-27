import { collections } from '$constants/mongo'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { ApiError } from '../apiError'

export async function saveDeviceAuthorization(
  user: AuthenticatedUser | null,
  deviceId: string,
  signature: string
) {
  if (!user) {
    throw new ApiError({
      code: 'UNAUTHORIZED',
      message: 'User is not authenticated',
    })
  }

  const userDoc = await collections.users.findOne({ uid: user.uid })
  if (!userDoc) {
    throw new ApiError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'User not found in database. This should not happen.',
    })
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
