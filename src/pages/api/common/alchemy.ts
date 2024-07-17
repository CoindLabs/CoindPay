import type { NextApiRequest, NextApiResponse } from 'next'
import { Alchemy, AlchemySettings } from 'alchemy-sdk'
import { env } from '@/lib/types/env'

/**
 * 参考文档 https://docs.alchemy.com/reference/getnfts
 * @param req
 * @param res
 * @returns
 */
export default async function alchemy(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = env.serverAlchemyId
  if (!req.body || !apiKey) {
    return res.status(301).json({
      message: 'missing api key parameter',
    })
  }

  const { address, network, options, type = 'getNftsForOwner', tokenId } = req.body
  const setting: AlchemySettings = {
    apiKey,
    network,
  }
  const alchemy = new Alchemy(setting)
  try {
    const fetchData = await alchemy.nft[type](address, {
      ...options,
    })
    res.status(200).json({
      ok: true,
      data: fetchData,
    })
  } catch (error) {
    res.status(500).json({
      message: 'request status error:' + error,
    })
  }
}
