import { collections } from '$constants/mongo.ts'
import { ObjectId } from 'mongodb'
import { generateMessageHash } from '../signatures/generateSignature.ts'
import { verifySignature } from '../signatures/verifySignature.ts'
import { finalizeAuthentication } from './finalizeAuthentication.ts'
import type { Handler } from 'elysia'

type Set = Parameters<Handler>[0]['set']

export async function authenticateDeviceAuthorizationSignature(
  deviceId: string,
  signature: string,
  set: Set
) {
  const result = await verifySignature(signature)
  if (!result.verified) {
    set.status = 401
    return 'Signature is not verified'
  }

  const expectedMessage = `mobileAuthorize:${deviceId}`
  const expectedMessageHash = generateMessageHash(expectedMessage)
  if (result.messageHash !== expectedMessageHash) {
    set.status = 401
    return 'Signature is not for mobile authorization'
  }

  if (Date.parse(result.timestamp) < Date.now() - 15 * 60e3) {
    set.status = 401
    return 'Signature is expired'
  }

  const userId = result.userId
  const user = await collections.users.findOne({ _id: new ObjectId(userId) })
  if (!user) {
    set.status = 500
    return 'User not found in database. This should not happen.'
  }

  return finalizeAuthentication(user.uid)
}
