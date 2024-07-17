import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { fetcher } from '@/lib/fetcher'
import s3Upload from '../s3/upload'
import { env } from '@/lib/types/env'

interface siteRequest extends NextApiRequest {
  query: {
    path: string
    uuid: string
  }
}

export default async function SiteShot(req: siteRequest, res: NextApiResponse) {
  const { query } = req

  if (!query?.path || !query.uuid) {
    return res.status(301).json({
      message: 'path required',
    })
  }
  const { path, uuid } = query
  try {
    const imageRes = await fetcher({
      url: `https://api.site-shot.com/screenshot?url=${path}?shareOff=1&userkey=${process.env?.SCREEN_SITE_SHOT}&width=1920&height=1080&zoom=280&format=JPEG`,
      responseType: 'arraybuffer',
      method: 'GET',
    })
    // s3会在进行一遍encode 所以需要多加一层
    const key = `user/${uuid}/${encodeURIComponent(encodeURIComponent(path))}.png`
    await s3Upload(`user/${uuid}/`, imageRes, encodeURIComponent(path) + '.png')
    res.status(200).json({
      ok: true,
      data: {
        url: env.awsCDN + key,
      },
    })
  } catch (error) {
    res.status(500).json({
      data: error,
    })
  }
}
