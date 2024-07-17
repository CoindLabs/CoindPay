import type { NextApiRequest, NextApiResponse } from 'next'
import { EvmChain } from '@moralisweb3/common-evm-utils'
import Moralis from 'moralis'
import { env } from '@/lib/types/env'

/**
 * 参考文档 https://docs.moralis.io/web3-data-api/evm/reference/price/get-token-price
 * @param req
 * @param res
 * @returns
 */

const moralisInit = async () => {
  try {
    await Moralis.start({
      apiKey: env.moralisKey,
    })
    return
  } catch (e) {
    let errorStr
    if (e instanceof Error) {
      errorStr = e.message
    } else {
      errorStr = JSON.stringify(e)
    }
    throw e
  }
}

export default async function moralis(req: NextApiRequest, res: NextApiResponse) {
  const { address, tokens, type = 'getTokenPrice', ...options } = req.body
  let chain = null

  if (type == 'getMultipleTokenPrices' && req.query?.chain) {
    chain = req.query?.chain
  } else {
    chain = req.body?.chain
  }

  if (!chain) {
    throw new Error('Invalid params request')
    return
  }
  // 注意这个chain字段要放在options的后面，防止被覆盖
  let priceParams = address ? { ...options, address, chain: EvmChain[chain] } : { chain: EvmChain[chain] }

  const onMoralisReq = async () => {
    let price = await Moralis.EvmApi.token[type](priceParams, tokens ? { tokens } : undefined)
    res.status(200).json({
      ok: true,
      data: price,
    })
  }

  try {
    await onMoralisReq()
  } catch (error) {
    // init key
    if (error?.message?.includes('apiKey is not set')) {
      await moralisInit()
      // 重试请求
      try {
        await onMoralisReq()
      } catch (retryError) {
        res.status(500).json({
          message: 'request status error after retry: ' + retryError,
        })
      }
    } else {
      res.status(500).json({
        message: 'request status error:' + error,
      })
    }
  }
}
