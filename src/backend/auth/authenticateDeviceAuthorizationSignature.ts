import { collections } from '$constants/mongo'
import { TRPCError } from '@trpc/server'
import { ObjectId } from 'mongodb'
import { generateMessageHash } from '../signatures/generateSignature'
import { verifySignature } from '../signatures/verifySignature'
import { finalizeAuthentication } from './finalizeAuthentication'

export async function authenticateDeviceAuthorizationSignature(
  deviceId: string,
  signature: string
) {
  const result = await verifySignature(signature)
  if (!result.verified) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Signature is not verified',
    })
  }

  const expectedMessage = `mobileAuthorize:${deviceId}`
  const expectedMessageHash = generateMessageHash(expectedMessage)
  if (result.messageHash !== expectedMessageHash) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Signature is not for mobile authorization',
    })
  }

  const userId = result.userId
  const user = await collections.users.findOne({ _id: new ObjectId(userId) })
  if (!user) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'User not found in database. This should not happen.',
    })
  }

  return finalizeAuthentication(user.uid)
}
