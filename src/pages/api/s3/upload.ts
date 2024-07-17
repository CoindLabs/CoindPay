import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_SECRET_ACCESS_KEY,
  },
})
/**
 *
 * @param path 上传至文件夹的路径 请在结尾加上“/”
 * @param file buffer类型 因为node端不能使用new File() 所以这里创建一个专供node层使用的s3上传
 * @param fileName 文件名
 * @returns
 */
export default async function s3Upload(path, file, fileName) {
  try {
    const putCmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: `${path}${fileName}`,
      Body: file,
      ACL: 'public-read',
      ContentType: 'image/png',
    })

    const a = await s3Client.send(putCmd)
    return path + fileName
  } catch (error) {
    throw Error(error)
  }
}
