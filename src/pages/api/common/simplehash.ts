import { NextApiRequest, NextApiResponse } from 'next'
import { fetcher } from '@/lib/fetcher'
import { env } from '@/lib/types/env'

/**
 * 参考文档 https://docs.simplehash.com/reference/nfts-by-owners
 * @param req
 * @param res
 * @returns
 */

export default async function simplehash(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = env?.simplehashKey
  if (!req.body || !apiKey) {
    return res.status(301).json({
      message: 'missing api key parameter',
    })
  }
  const { address, chains, queried_wallet_balances = 1, count = 1, limit = 50, ...rest } = req.body

  try {
    let nfts = await fetcher({
      baseURL: 'https://api.simplehash.com',
      url: '/api/v0/nfts/owners',
      headers: {
        'x-api-key': apiKey,
      },
      params: {
        chains,
        wallet_addresses: address,
        queried_wallet_balances,
        count,
        limit,
        ...rest,
      },
    })
    res.status(200).json({
      ok: true,
      data: nfts,
    })
  } catch (error) {
    res.status(500).json({
      message: 'request status error:' + error,
    })
  }
}
