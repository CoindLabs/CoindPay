import { S3Client } from '@aws-sdk/client-s3'
import { BUCKET_REGION, ACCESS_KEY_ID, ACCESS_SECRET_ACCESS_KEY, S3_BUCKET } from './config'
import { generateRandomString } from '@/lib/utils'

import config from '@/config'

const { domains } = config

export const cdnURL =
  process.env.NODE_ENV == 'development' ||
  process.env.VERCEL_ENV == 'development' ||
  process.env.VERCEL_ENV == 'preview'
    ? domains.cdn_test
    : domains.cdn

export const s3Client = new S3Client({
  region: BUCKET_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: ACCESS_SECRET_ACCESS_KEY,
  },
})

export const getUserPath = (uuid: string) => {
  return `user/${uuid || 'empty-user'}`
}

export const getEncodeFileName = (fileName: string) => {
  let timestamp = Date.now(),
    randomStr = generateRandomString(),
    fileExtension = fileName.split('.').pop()
  return `${timestamp}${randomStr}.${fileExtension}`
}

export const getInitUploads = (uploads = []) => {
  if (!uploads?.length) return
  return uploads.map(upload => ({
    source: upload.url,
    options: {
      type: 'remote',
      file: {
        name: upload.name,
        size: upload.size,
        type: upload.type,
      },
    },
  }))
}
