import { MongoClient } from 'mongodb'

import { mongoAddress } from './secrets/mongoAddress'

const globalMongo = global as unknown as {
  mongo?: MongoClient
}

export const mongo = globalMongo.mongo || new MongoClient(mongoAddress)

if (!import.meta.env.PROD) globalMongo.mongo = mongo
