import { ObjectId } from 'mongodb'

import { collections } from '$constants/mongo'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { Role } from '$types/Role'

export const checkAccess = async (user: AuthenticatedUser | null) => {
  if (!user) {
    return { granted: false, reason: 'You are not logged in.' }
  }

  if (Date.now() < Date.parse('2024-01-14T23:59:59.999Z')) {
    return { granted: true }
  }

  const partialUserDoc = await collections.users.findOne(
    { _id: new ObjectId(user.sub) },
    { projection: { roles: 1 } }
  )
  if (!partialUserDoc) {
    return { granted: false, reason: 'User not found in database.' }
  }

  let granted = (partialUserDoc.roles ?? []).some(
    role => role === Role.GardenZero
  )

  if (granted) {
    return {
      granted: true,
    }
  } else {
    return {
      granted: false,
      reason: 'insufficient roles',
    }
  }
}
