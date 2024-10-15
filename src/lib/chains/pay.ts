import { logoChains } from './logo'
import { customChains } from './custom'
import { env } from '../types/env'
import * as pay from './tokens'

import config from '@/config'

const { domains } = config

const isProd = env?.isProd

/**
 * 已开通或即将开通支付的链配置
 */
export const payChains = [
  {
    name: isProd ? 'Solana' : 'Solana Devnet',
    icon: 'https://cryptologos.cc/logos/thumbs/solana.png',
    chainId: 1151111081099710, // 参考 https://docs.li.fi/list-chains-bridges-dex-aggregators-solvers#supported-chains
    chainIdProd: 1151111081099710,
    ...pay?.solana,
  },
  {
    name: isProd ? 'Ethereum' : 'Ethereum Sepolia',
    icon: 'https://cryptofonts.com/img/SVG/cbeth.svg',
    chainId: isProd ? 1 : 11155111,
    chainIdProd: 1,
    ...pay?.ethereum,
  },
  {
    name: isProd ? 'Base' : 'Base Sepolia',
    icon: logoChains.base,
    chainNamePrice: 'BASE',
    chainId: isProd ? 8453 : 84532,
    chainIdProd: 8453,
    ...pay?.base,
  },
  {
    name: isProd ? 'Optimism' : 'Optimism Sepolia',
    icon: `${domains.cdn}/static/social/op.svg`,
    chainId: isProd ? 10 : 11155420,
    chainIdProd: 10,
    ...pay?.optimism,
  },
  {
    name: isProd ? 'Arbitrum' : 'Arbitrum Sepolia',
    icon: logoChains.arbitrum,
    chainId: isProd ? 42161 : 421614,
    chainIdProd: 42161,
    ...pay?.arbitrum,
  },
  {
    name: isProd ? 'BSC' : 'BSC Testnet',
    icon: 'https://cryptofonts.com/img/brands/binance.svg',
    chainId: isProd ? 56 : 97,
    chainIdProd: 56,
    ...pay?.bsc,
  },
  {
    name: isProd ? 'Polygon' : 'Polygon Amoy Testnet',
    icon: logoChains.polygon,
    chainId: isProd ? 137 : 80002,
    chainIdProd: 137,
    ...pay?.polygon,
  },
  {
    name: isProd ? 'zkSync' : 'zkSync Sepolia',
    icon: logoChains.zksync,
    chainId: isProd ? 324 : 300,
    chainIdProd: 324,
    ...pay?.zkSync,
  },
  {
    name: isProd ? 'Metis' : 'Metis Sepolia',
    icon: logoChains.metis,
    chainId: isProd ? 1088 : 59902,
    chainIdProd: 1088,
    ...pay?.metis,
  },
  {
    name: isProd ? 'Sei' : 'Sei Testnet',
    icon: logoChains.sei,
    chainId: 1329,
    chainIdProd: 1329,
    ...pay?.sei,
  },
  {
    name: isProd ? 'Scroll' : 'Scroll Sepolia',
    chainId: isProd ? 534352 : 534351,
    chainIdProd: 534352,
    ...pay?.scroll,
  },
  {
    name: isProd ? 'Gnosis' : 'Gnosis Testnet',
    icon: logoChains.gnosis,
    chainId: isProd ? 100 : 10200,
    chainIdProd: 100,
    ...pay?.gnosis,
  },
  {
    name: isProd ? 'Fuse' : 'Fuse Sparknet',
    chainId: isProd ? 122 : 123,
    chainIdProd: 122,
    ...pay?.fuse,
  },
  {
    name: isProd ? 'Aurora' : 'Aurora Testnet',
    icon: `${domains.cdn}/static/social/aurora.svg`,
    chainId: isProd ? 1313161554 : 1313161555,
    chainIdProd: 1313161554,
    ...pay?.aurora,
  },
  {
    name: 'ICP',
    disabled: true,
  },
  {
    name: 'Bitcoin',
    disabled: true,
  },
  {
    name: 'TON',
    disabled: true,
  },
  {
    name: 'Blast',
    disabled: true,
  },
  {
    name: isProd ? 'Zeta' : 'Zeta Testnet',
    icon: logoChains.zeta,
    chainId: isProd ? 7000 : 7001,
    chainIdProd: 7000,
    ...pay?.zeta,
    disabled: true,
  },
  {
    name: 'BeraChain',
    icon: logoChains.berachain,
    disabled: true,
  },
  {
    name: 'Linea',
    disabled: true,
  },
  {
    name: 'Aptos',
    disabled: true,
  },
  {
    name: 'Sui',
    disabled: true,
  },
  {
    name: 'Mantle',
    disabled: true,
  },
  {
    name: 'Manta',
    disabled: true,
  },
  {
    name: 'Avalanche',
    disabled: true,
  },
  {
    name: 'Near',
    disabled: true,
  },
]
