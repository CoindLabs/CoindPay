import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const options = {
  maxIdleTimeMS: 270000,
  minPoolSize: 2,
  maxPoolSize: 4,
  serverApi: ServerApiVersion.v1,
}

const callback = async db => {
  const users = await db.collection('users')
}

const setup = async () => {
  let client

  try {
    client = new MongoClient(process.env.MONGODB_URI, options)
    const c = await client.connect()
    await callback(c.db('dev'))
  } catch (error) {
    return 'Database is not ready yet'
  } finally {
    if (client) {
      await client.close()
    }
  }
}

try {
  setup()
} catch {
  console.warn('Database is not ready yet. Skipping seeding...')
}

export { setup }
