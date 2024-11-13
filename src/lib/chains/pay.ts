import { logoChains } from './logo'
import { env } from '../types/env'
import * as pay from './tokens'

import config from '@/config'
import { avatarClasses } from '@mui/material'

const { domains } = config

const isProd = env?.isProd

/**
 * 已开通或即将开通支付的链配置
 */
export const payChains = [
  {
    name: isProd ? 'Solana' : 'Solana Devnet',
    icon: logoChains.solana_bg,
    chainId: 1151111081099710, // 参考 https://docs.li.fi/list-chains-bridges-dex-aggregators-solvers#supported-chains
    chainIdProd: 1151111081099710,
    type: 'SVM',
    ...pay?.solana,
  },
  {
    name: isProd ? 'SOON' : 'SOON Devnet',
    icon: logoChains.soon_flat,
    avatarClass: 'bg-black',
    chainId: 1151111081099710,
    chainIdProd: 1151111081099710,
    type: 'SVM',
    ...pay?.soon,
  },
  {
    name: isProd ? 'Ethereum' : 'Ethereum Sepolia',
    icon: 'https://cryptofonts.com/img/SVG/cbeth.svg',
    chainId: isProd ? 1 : 11155111,
    chainIdProd: 1,
    type: 'EVM',
    ...pay?.ethereum,
  },
  {
    name: isProd ? 'Base' : 'Base Sepolia',
    icon: logoChains.base,
    chainNamePrice: 'BASE',
    chainId: isProd ? 8453 : 84532,
    chainIdProd: 8453,
    type: 'EVM',
    ...pay?.base,
  },
  {
    name: isProd ? 'Optimism' : 'Optimism Sepolia',
    icon: logoChains.optimism,
    chainId: isProd ? 10 : 11155420,
    chainIdProd: 10,
    type: 'EVM',
    ...pay?.optimism,
  },
  {
    name: isProd ? 'Arbitrum' : 'Arbitrum Sepolia',
    icon: logoChains.arbitrum,
    chainId: isProd ? 42161 : 421614,
    chainIdProd: 42161,
    type: 'EVM',
    ...pay?.arbitrum,
  },
  {
    name: isProd ? 'BSC' : 'BSC Testnet',
    icon: 'https://cryptofonts.com/img/brands/binance.svg',
    chainId: isProd ? 56 : 97,
    chainIdProd: 56,
    type: 'EVM',
    ...pay?.bsc,
  },
  {
    name: isProd ? 'Polygon' : 'Polygon Amoy Testnet',
    icon: logoChains.polygon,
    chainId: isProd ? 137 : 80002,
    chainIdProd: 137,
    type: 'EVM',
    ...pay?.polygon,
  },
  {
    name: isProd ? 'zkSync' : 'zkSync Sepolia',
    icon: logoChains.zksync,
    chainId: isProd ? 324 : 300,
    chainIdProd: 324,
    type: 'EVM',
    ...pay?.zkSync,
  },
  {
    name: isProd ? 'Metis' : 'Metis Sepolia',
    icon: logoChains.metis,
    chainId: isProd ? 1088 : 59902,
    chainIdProd: 1088,
    type: 'EVM',
    ...pay?.metis,
  },
  {
    name: isProd ? 'Sei' : 'Sei Testnet',
    icon: logoChains.sei,
    chainId: 1329,
    chainIdProd: 1329,
    type: 'EVM',
    ...pay?.sei,
  },
  {
    name: isProd ? 'Scroll' : 'Scroll Sepolia',
    chainId: isProd ? 534352 : 534351,
    chainIdProd: 534352,
    type: 'EVM',
    ...pay?.scroll,
  },
  {
    name: isProd ? 'Celo' : 'Celo Testnet',
    chainId: isProd ? 42220 : 44787,
    chainIdProd: 42220,
    type: 'EVM',
    ...pay?.celo,
  },
  {
    name: isProd ? 'Boba' : 'Boba Sepolia',
    icon: logoChains.boba,
    chainId: isProd ? 288 : 28882,
    chainIdProd: 288,
    type: 'EVM',
    ...pay?.boba,
  },
  {
    name: isProd ? 'Taiko' : 'Taiko Hekla',
    icon: logoChains.taiko,
    chainId: isProd ? 167000 : 167009,
    chainIdProd: 167000,
    type: 'EVM',
    ...pay?.taiko,
  },

  {
    name: isProd ? 'Gnosis' : 'Gnosis Testnet',
    icon: logoChains.gnosis,
    chainId: isProd ? 100 : 10200,
    chainIdProd: 100,
    type: 'EVM',
    ...pay?.gnosis,
  },
  {
    name: isProd ? 'Fuse' : 'Fuse Sparknet',
    chainId: isProd ? 122 : 123,
    chainIdProd: 122,
    type: 'EVM',
    ...pay?.fuse,
  },
  {
    name: isProd ? 'Aurora' : 'Aurora Testnet',
    icon: `${domains.cdn}/static/social/aurora.svg`,
    chainId: isProd ? 1313161554 : 1313161555,
    chainIdProd: 1313161554,
    type: 'EVM',
    ...pay?.aurora,
  },
  {
    name: 'Hashkey Testnet',
    icon: logoChains.hashkey,
    chainId: 133,
    chainIdProd: 133,
    type: 'EVM',
    ...pay?.hashkey,
  },
  {
    name: 'ICP',
    type: 'Others',
    disabled: true,
  },
  {
    name: 'Bitcoin',
    type: 'Others',
    disabled: true,
  },
  {
    name: 'TON',
    type: 'Others',
    disabled: true,
  },
  {
    name: 'Blast',
    type: 'Others',
    disabled: true,
  },
  {
    name: isProd ? 'Zeta' : 'Zeta Testnet',
    icon: logoChains.zeta,
    chainId: isProd ? 7000 : 7001,
    chainIdProd: 7000,
    type: 'EVM',
    ...pay?.zeta,
    disabled: true,
  },
  {
    name: 'BeraChain',
    icon: logoChains.berachain,
    type: 'EVM',
    disabled: true,
  },
  {
    name: 'Linea',
    type: 'EVM',
    disabled: true,
  },
  {
    name: 'Aptos',
    type: 'Others',
    disabled: true,
  },
  {
    name: 'Sui',
    type: 'Others',
    disabled: true,
  },
  {
    name: 'Mantle',
    type: 'EVM',
    disabled: true,
  },
  {
    name: 'Manta',
    type: 'EVM',
    disabled: true,
  },
  {
    name: 'Avalanche',
    type: 'EVM',
    disabled: true,
  },
  {
    name: 'Near',
    type: 'Others',
    disabled: true,
  },
]

export const _payChains = Object.values(
  payChains.reduce((acc, chain) => {
    let type = chain?.['type'] || 'Others'
    acc[type] = acc[type] || { type, list: [] }
    acc[type].list.push(chain)
    return acc
  }, {})
)
