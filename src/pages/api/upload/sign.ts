import { NextApiRequest, NextApiResponse } from 'next'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { cdnURL, getEncodeFileName, getUserPath, s3Client } from '@/lib/aws'
import { S3_BUCKET } from '@/lib/aws/config'

export default async function s3upload_sign(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed ˙◠˙' })
  }

  let { files, path, uuid } = req.body

  if (!files || !files?.length) {
    return res.status(400).json({ message: 'Missing required fields ˙◠˙' })
  }

  path = path || `${getUserPath(uuid)}`

  let urls = [],
    failedFiles = []

  try {
    const results = await Promise.allSettled(
      files.map(async file => {
        const fileKey = `${path}/${getEncodeFileName(file?.fileName)}`

        const command = new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: fileKey,
          ContentType: file.fileType,
          ACL: 'public-read',
        })

        const signedURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
        const publicURL = `${cdnURL}/${fileKey}`

        return { signedURL, publicURL }
      })
    )

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        urls.push(result.value)
      } else if (result.status === 'rejected') {
        failedFiles.push({
          fileName: files[index]?.fileName,
          error: result.reason instanceof Error ? result.reason.message : 'Unknown error ˙◠˙',
        })
      }
    })

    res.status(200).json({ ok: true, message: 'Files uploaded success ᵔ◡ᵔ', data: urls, failed: failedFiles })
  } catch (error) {
    console.error('Error uploading files:', error)
    res
      .status(500)
      .json({ ok: false, message: 'Server error ˙◠˙', error: error instanceof Error ? error.message : error })
  }
}
