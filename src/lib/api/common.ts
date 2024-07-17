import mongodbPromise from '@/lib/mongodb/mongodb_master'

/**
 * db取合集数据
 * @param key 默认取user表
 * @returns
 */
export async function getDBCollection(key = 'user') {
  const client = await mongodbPromise
  return await client.db().collection(key)
}
