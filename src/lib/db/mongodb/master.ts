import { getMongoDB } from '.'

const uri = process.env.MONGODB_URI as string // your mongodb connection string

export default getMongoDB(uri, 'master')
