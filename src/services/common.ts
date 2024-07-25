import { Network, AlchemySettings, GetNftsForOwnerOptions } from 'alchemy-sdk'
import { fetcher } from '@/lib/fetcher'
import { env } from '@/lib/types/env'
import { solana, base } from '@/lib/chains/tokens'
//https://docs.alchemy.com/reference/getnftsforcollection
interface IAlchemy extends AlchemySettings {
  type?: string // 默认 getNftsForOwner
  address: string
  network: Network
  options?: GetNftsForOwnerOptions
}

interface INFTSan_GETALLNFT {
  address: string
}

export function getAlchemySvc(data: IAlchemy) {
  return fetcher({
    url: 'api/common/alchemy',
    method: 'post',
    data,
  })
}

export function getNFTScanSvc(data: INFTSan_GETALLNFT) {
  return fetcher({
    url: 'api/common/nftscan',
    method: 'post',
    data,
  })
}
export function getSimplehashSvc(data) {
  return fetcher({
    url: 'api/common/simplehash',
    method: 'post',
    data,
  })
}

export function getPoapSvc(data) {
  return fetcher({
    // baseURL: getAPIsOrigin(),
    url: 'api/common/poap',
    params: data,
  })
}

export function getLightGalxeSvc(data) {
  if (!data?.address) return
  return fetcher({
    baseURL: `https://lightcache.net/galaxy/${data?.address}`,
  })
}

export function getGalxeCredentialSvc(data) {
  if (!data?.address) return
  return fetcher({
    url: 'api/common/galxe',
    params: data,
  })
}

/**
 * https://docs.space.id/developer-guide/web3-name-sdk/sid-api
 * @param tld、address
 */
export function getSpaceIDReverseNameSvc({ tld = 'bnb', address }) {
  return fetcher({
    url: 'api/common/spaceid',
    params: { tld, address },
  })
}
/**
 * 截屏服务
 */
export function getSiteShotSvc({ path = '', uuid = '' }) {
  return fetcher({
    url: `api/common/siteshot?path=${path}&uuid=${uuid}`,
  })
}
/**
 * Serper关键词查询图片
 * @param data
 * @returns
 */
export function getSerperImageSvc(data) {
  return fetcher({
    url: 'api/dapp/serper_image',
    params: data,
  })
}

export function getIframelySvc(data) {
  if (!data?.url) return
  return fetcher({
    baseURL: 'https://iframe.ly/api/iframely',
    params: {
      url: data.url,
      api_key: env.iframelyKey,
      iframe: 1,
      omit_script: 1,
      ...data?.params,
    },
  })
}
/**
 * solana token list
 * api https://station.jup.ag/docs/token-list/token-list-api
 * docs https://station.jup.ag/docs
 */
export async function getSolTokenListSvc({ mode = 'strict' } = {}) {
  let mainList = await fetcher({
    baseURL: `https://token.jup.ag/${mode}`,
  })
  // 默认strict模式，加载全部 all模式，prod拼接防止接口usdc和sol顺序变换
  return env?.isProd
    ? solana.list.concat(mainList.filter(row => ![solana.mocks.sol, solana.mocks.usdc].includes(row.address)))
    : solana.list
}
/**
 * base token list
 * docs https://base.blockscout.com/tokens
 */
export function getBaseTokenListSvc() {
  return base.list
  // env?.isProd && fetcher({
  //       baseURL: 'https://base.blockscout.com/api/v2/tokens',
  //     })
}

/**
 * docs https://station.jup.ag/docs/apis/price-api
 * @param ids token符号或地址，支持数组，分隔符,
 * @param vsToken 被兑换的token
 */
export function getJupTokenPriceSvc(data) {
  if (!data?.ids) return
  const { ids, vsToken } = data
  return fetcher({
    baseURL: 'https://price.jup.ag/v4/price',
    params: {
      ids,
      vsToken,
    },
  })
}
/** docs https://docs.moralis.io/web3-data-api
 * @Moralis {}
 * @param data token/nft/price
 */
export function getMoralisTokenSvc(data, params = undefined) {
  return fetcher({
    url: 'api/common/moralis',
    method: 'post',
    data,
    params,
  })
}

export function get1InchTokenSvc(params) {
  if (!params?.chainId || !params?.address) return
  const { chainId, address } = params
  return fetcher({
    baseURL: `https://token-prices.1inch.io/v1.1/${chainId}/${address}`,
    params: {
      currency: 'usd',
    },
  })
}
