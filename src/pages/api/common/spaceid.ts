import type { NextApiRequest, NextApiResponse } from 'next'
import { fetcher } from '@/lib/fetcher'

export default async function SpaceId(req: NextApiRequest, res: NextApiResponse) {
  const { path = 'getName', tld, address } = req.query
  if (!tld || !address)
    return res.status(301).json({
      message: 'missing required parameter',
    })
  try {
    let bnbData = await fetcher({
      baseURL: `https://api.prd.space.id/v1/${path}`,
      params: { tld, address },
    })
    if (bnbData?.name) bnbData = Object.assign(bnbData, { ok: true })
    res.status(200).json(bnbData)
  } catch (error) {
    res.status(500).json({
      message: 'request status error:' + error,
    })
  }
}
