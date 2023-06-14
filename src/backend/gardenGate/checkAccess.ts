import { ObjectId } from 'mongodb'

import { mongo } from '$constants/mongo'

import type { User } from '$types/mongo/User'
import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import { Role } from '$types/Role'

export const checkAccess = async (user: AuthenticatedUser | null) => {
  if (!user) {
    return { granted: false, reason: 'You are not logged in.' }
  }

  const partialUserDoc = (await mongo
    .db('creatorsgarten-org')
    .collection('users')
    .findOne(
      { _id: new ObjectId(user.sub) },
      {
        projection: {
          roles: 1,
        },
      }
    )) as Pick<User, '_id' | 'roles'>

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
      reason: 'insufficient roles'
    }
  }
}
