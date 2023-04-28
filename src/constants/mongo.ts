import { MongoClient } from 'mongodb'

import { mongoAddress } from './secrets/mongoAddress'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var mongo: MongoClient | undefined
}

console.log(import.meta.env)

export const mongo = global.mongo || new MongoClient(mongoAddress)

if (!import.meta.env.PROD) global.mongo = mongo
