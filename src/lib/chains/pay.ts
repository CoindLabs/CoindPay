import { logoChains } from './logo'
import { isDevnet, isAlpha } from '@/lib/utils/env'
import * as pay from './tokens'

import config from '@/config'

const { domains } = config

/**
 * 已开通或即将开通支付的链配置
 */
export const payChains = [
  {
    name: isDevnet ? 'SOON Devnet' : isAlpha ? 'SOON Testnet' : 'SOON',
    icon: logoChains.soon_flat,
    media: { x: 'soon_svm' },
    avatarClass: 'bg-black',
    chainId: 1151111081099710,
    chainIdProd: 1151111081099710,
    type: 'SVM',
    ...pay?.soon,
  },
  {
    name: isDevnet ? 'Solana Devnet' : 'Solana',
    icon: logoChains.solana_bg,
    media: { x: 'solana' },
    chainId: 1151111081099710, // 参考 https://docs.li.fi/list-chains-bridges-dex-aggregators-solvers#supported-chains
    chainIdProd: 1151111081099710,
    type: 'SVM',
    ...pay?.solana,
  },
  {
    name: isDevnet ? 'Ethereum Sepolia' : 'Ethereum',
    icon: 'https://cryptofonts.com/img/SVG/cbeth.svg',
    media: { x: 'Ethereum' },
    chainId: isDevnet ? 11155111 : 1,
    chainIdProd: 1,
    type: 'EVM',
    ...pay?.ethereum,
  },
  {
    name: isDevnet ? 'Base Sepolia' : 'Base',
    icon: logoChains.base,
    media: { x: 'Base' },
    chainNamePrice: 'BASE',
    chainId: isDevnet ? 84532 : 8453,
    chainIdProd: 8453,
    type: 'EVM',
    ...pay?.base,
  },
  {
    name: isDevnet ? 'Metis Sepolia' : 'Metis',
    icon: logoChains.metis,
    media: { x: 'MetisL2' },
    chainId: isDevnet ? 59902 : 1088,
    chainIdProd: 1088,
    type: 'EVM',
    ...pay?.metis,
  },
  {
    name: isDevnet ? 'Optimism Sepolia' : 'Optimism',
    icon: logoChains.optimism,
    media: { x: 'Optimism' },
    chainId: isDevnet ? 11155420 : 10,
    chainIdProd: 10,
    type: 'EVM',
    ...pay?.optimism,
  },
  {
    name: isDevnet ? 'Arbitrum Sepolia' : 'Arbitrum',
    icon: logoChains.arbitrum,
    media: { x: 'Arbitrum' },
    chainId: isDevnet ? 421614 : 42161,
    chainIdProd: 42161,
    type: 'EVM',
    ...pay?.arbitrum,
  },
  {
    name: isDevnet ? 'BSC Testnet' : 'BSC',
    icon: 'https://cryptofonts.com/img/brands/binance.svg',
    media: { x: 'BNBCHAIN' },
    chainId: isDevnet ? 97 : 56,
    chainIdProd: 56,
    type: 'EVM',
    ...pay?.bsc,
  },
  {
    name: isDevnet ? 'Polygon Amoy Testnet' : 'Polygon',
    icon: logoChains.polygon,
    media: { x: 'Polygon' },
    chainId: isDevnet ? 80002 : 137,
    chainIdProd: 137,
    type: 'EVM',
    ...pay?.polygon,
  },
  {
    name: isDevnet ? 'zkSync Sepolia' : 'zkSync',
    icon: logoChains.zksync,
    media: { x: 'zksync' },
    chainId: isDevnet ? 300 : 324,
    chainIdProd: 324,
    type: 'EVM',
    ...pay?.zkSync,
  },
  {
    name: isDevnet ? 'Sei Testnet' : 'Sei',
    icon: logoChains.sei,
    media: { x: 'SeiNetwork' },
    chainId: 1329,
    chainIdProd: 1329,
    type: 'EVM',
    ...pay?.sei,
  },
  {
    name: isDevnet ? 'Scroll Sepolia' : 'Scroll',
    media: { x: 'Scroll_ZKP' },
    chainId: isDevnet ? 534351 : 534352,
    chainIdProd: 534352,
    type: 'EVM',
    ...pay?.scroll,
  },
  {
    name: isDevnet ? 'Celo Testnet' : 'Celo',
    media: { x: 'Celo' },
    chainId: isDevnet ? 44787 : 42220,
    chainIdProd: 42220,
    type: 'EVM',
    ...pay?.celo,
  },
  {
    name: isDevnet ? 'Boba Sepolia' : 'Boba',
    icon: logoChains.boba,
    media: { x: 'Boba' },
    chainId: isDevnet ? 28882 : 288,
    chainIdProd: 288,
    type: 'EVM',
    ...pay?.boba,
  },
  {
    name: isDevnet ? 'Taiko Hekla' : 'Taiko',
    icon: logoChains.taiko,
    media: { x: 'taikoxyz' },
    chainId: isDevnet ? 167009 : 167000,
    chainIdProd: 167000,
    type: 'EVM',
    ...pay?.taiko,
  },
  {
    name: isDevnet ? 'Gnosis Testnet' : 'Gnosis',
    icon: logoChains.gnosis,
    media: { x: 'gnosischain' },
    chainId: isDevnet ? 10200 : 100,
    chainIdProd: 100,
    type: 'EVM',
    ...pay?.gnosis,
  },
  {
    name: isDevnet ? 'Fuse Sparknet' : 'Fuse',
    media: { x: 'Fuse_network' },
    chainId: isDevnet ? 123 : 122,
    chainIdProd: 122,
    type: 'EVM',
    ...pay?.fuse,
  },
  {
    name: isDevnet ? 'Aurora Testnet' : 'Aurora',
    icon: `${domains.cdn}/static/social/aurora.svg`,
    media: { x: 'auroraisnear' },
    chainId: isDevnet ? 1313161555 : 1313161554,
    chainIdProd: 1313161554,
    type: 'EVM',
    ...pay?.aurora,
  },
]

export const _payChains = (chains = null) =>
  Object.values(
    (chains || payChains).reduce((acc, chain) => {
      let type = chain?.['type'] || 'Others'
      acc[type] = acc[type] || { type, list: [] }
      acc[type].list.push(chain)
      return acc
    }, {})
  )
