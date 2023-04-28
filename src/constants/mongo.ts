import { MongoClient } from 'mongodb'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var mongo: MongoClient | undefined
}

export const mongo = global.mongo || new MongoClient(import.meta.env.MONGO_ADDRESS)

if (!import.meta.env.PROD) global.mongo = mongo
