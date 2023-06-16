import { ObjectId } from 'mongodb'

import { collections } from '$constants/mongo'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { Role } from '$types/Role'

export const checkAccess = async (user: AuthenticatedUser | null) => {
  if (!user) {
    return { granted: false, reason: 'You are not logged in.' }
  }

  const partialUserDoc = await collections.users.findOne(
    { _id: new ObjectId(user.sub) },
    { projection: { roles: 1 } }
  )
  if (!partialUserDoc) {
    return { granted: false, reason: 'User not found in database.' }
  }

  let granted = [Role.CoreOfCore, Role.GardenZero].some(role =>
    (partialUserDoc.roles ?? []).some(userRole => userRole === role)
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
