import { NextApiRequest, NextApiResponse } from 'next'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { cdnURL, getEncodeFileName, getUserPath, s3Client } from '@/lib/aws'
import { S3_BUCKET } from '@/lib/aws/config'

export default async function s3upload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed ˙◠˙' })
  }

  let { fileName, fileType, file, path, uuid } = req.body

  if (!fileName || !fileType || !file) {
    return res.status(400).json({ message: 'Missing required fields ˙◠˙' })
  }

  path = path || `${getUserPath(uuid)}`

  let fileKey = `${path}/${getEncodeFileName(fileName)}`

  try {
    const putCmd = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileKey,
      Body: Buffer.from(file, 'base64'),
      ACL: 'public-read',
      ContentType: fileType,
    })

    await s3Client.send(putCmd)

    const fileUrl = `${cdnURL}/${fileKey}`

    res.status(200).json({ ok: true, message: 'File uploaded success ᵔ◡ᵔ', data: fileUrl })
  } catch (error) {
    console.error('Error uploading file:', error)
    res
      .status(500)
      .json({ ok: false, message: 'Server error ˙◠˙', error: error instanceof Error ? error.message : error })
  }
}
