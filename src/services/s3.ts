import { fetcher } from '@/lib/fetcher'
import { env } from '@/lib/types/env'

type SignatureProps = {
  signature: string
  url: string
  policyB64: string
  credentials: string
  date: string
}

const getUserId = (uuid: string) => {
  return uuid || 'empty-user'
}

const getFileType = (file: File) => {
  const chunks = file.name.split('.')
  if (chunks.length) {
    return chunks[chunks.length - 1]
  }
}

const getSignature = async (userId: string, type: string): Promise<SignatureProps> => {
  return (await fetcher({
    url: 'api/s3/signature',
    method: 'post',
    data: { userId, type },
  })) as SignatureProps
}

export const s3UploadSvc = async (file: File, uuid?: string, imageName?: string) => {
  const userId = getUserId(uuid)
  const fileType = getFileType(file)

  console.log({ userId })
  try {
    const { signature, credentials, date, policyB64, url } = await getSignature(userId, fileType)
    const key = imageName
      ? `user/${userId}/${imageName}${fileType ? '.' + fileType : '.jpg'}`
      : `user/${userId}/${Date.now()}${fileType ? '.' + fileType : '.jpg'}`
    await fetcher({
      method: 'post',
      url,
      headers: { 'Content-Type': 'multipart/form-data' },
      data: {
        acl: 'public-read',
        'Content-Type': `image/${fileType || 'jpg'}`,
        'x-amz-credential': credentials,
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-date': date,
        Policy: policyB64,
        'x-amz-signature': signature,
        key,
        file,
      },
    })
    return env.awsCDN + key
  } catch (e) {
    throw Error(e.message)
  }
}
