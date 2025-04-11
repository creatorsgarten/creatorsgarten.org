import { MongoClient } from 'mongodb'
import { MONGO_ADDRESS } from 'astro:env/server'

import type { DeviceAuthorization } from '$types/mongo/DeviceAuthorization'
import type { GardenAccess } from '$types/mongo/GardenAccess'
import type { OAuthAudit } from '$types/mongo/OAuthAudit'
import type { User } from '$types/mongo/User'

const globalMongo = global as unknown as {
  mongo?: MongoClient
}

export const mongo = globalMongo.mongo || new MongoClient(MONGO_ADDRESS)

if (!import.meta.env.PROD) globalMongo.mongo = mongo

// We can call `.db` and `.collection` as much as we like.
// Until we actually make a query, it won't connect to the database.

const db = mongo.db('creatorsgarten-org')

export const collections = {
  users: db.collection<User>('users'),
  gardenAccesses: db.collection<GardenAccess>('gardenAccesses'),
  oAuthAudits: db.collection<OAuthAudit>('oAuthAudits'),
  deviceAuthorizations: db.collection<DeviceAuthorization>(
    'deviceAuthorizations'
  ),
}
