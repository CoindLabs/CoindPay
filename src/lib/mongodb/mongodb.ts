import { MongoClient, ServerApiVersion } from 'mongodb'

let options = {}
options = {
  ...options,
  maxIdleTimeMS: 270000,
  minPoolSize: 2,
  maxPoolSize: 4,
  serverApi: ServerApiVersion.v1,
}

declare global {
  var master: Promise<MongoClient>
  var api: Promise<MongoClient>
}

type DbType = 'master' | 'api'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

export const getMongoDB = (uri: string, type: DbType) => {
  let client
  let mongodbPromise: Promise<MongoClient>
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global[type]) {
      client = new MongoClient(uri, options)
      global[type] = client.connect()
    }
    mongodbPromise = global[type]
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    mongodbPromise = client.connect()
  }
  return mongodbPromise
}
