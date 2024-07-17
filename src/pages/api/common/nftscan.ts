import type { NextApiRequest, NextApiResponse } from 'next'
import { fetcher } from '@/lib/fetcher'
import { env } from '@/lib/types/env'

export default async function NFTScan(req: NextApiRequest, res: NextApiResponse) {
  if (!req?.body?.address) {
    return res.status(301).json({
      message: 'missing address parameter',
    })
  }
  const { address } = req.body

  try {
    const nftscanData = await fetcher({
      baseURL: 'https://bnbapi.nftscan.com',
      url: `/api/v2/account/own/all/${address}?erc_type=&show_attribute=false`,
      headers: {
        'x-api-key': env.nftscanAPIKey,
      },
    })
    res.status(200).json({
      ok: true,
      data: nftscanData,
    })
  } catch (error) {
    res.status(500).json({
      message: 'request status error:' + error,
    })
  }
}
