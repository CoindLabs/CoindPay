import type { NextApiRequest, NextApiResponse } from 'next'
import { fetcher } from '@/lib/fetcher'
import { env } from '@/lib/types/env'

export default async function POAP(req: NextApiRequest, res: NextApiResponse) {
  if (!req?.query?.address) {
    return res.status(301).json({
      message: 'missing address parameter',
    })
  }
  const { address } = req.query

  try {
    const poapData = await fetcher({
      baseURL: 'https://api.poap.tech',
      url: `/actions/scan/${address}`,
      headers: {
        'x-api-key': env.poapAPIKey,
        'Accept-Encoding': 'gzip,deflate,compress',
      },
    })
    res.status(200).json({
      ok: true,
      data: poapData,
    })
  } catch (error) {
    res.status(500).json({
      message: 'request status error:' + error,
    })
  }
}
