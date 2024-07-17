import { logoChains } from './logo'
import { customChains } from './custom'
import { env } from '../env'

import * as pay from '@/config/common/pay'
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
    ...pay?.solana,
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
    name: isProd ? 'zkSync' : 'zkSync Sepolia',
    icon: logoChains.zksync,
    chainId: isProd ? 324 : 300,
    chainIdProd: 324,
    ...pay?.zkSync,
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
    name: isProd ? 'Ethereum' : 'Ethereum Sepolia',
    icon: 'https://cryptofonts.com/img/SVG/cbeth.svg',
    chainId: isProd ? 1 : 11155111,
    chainIdProd: 1,
    ...pay?.ethereum,
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
    name: 'ICP',
    disabled: true,
  },
  {
    name: 'Sei',
    disabled: true,
  },
  {
    name: 'Binance',
    icon: 'https://cryptofonts.com/img/brands/binance.svg',
    disabled: true,
  },
  {
    name: 'Polygon',
    disabled: true,
  },
  {
    name: 'Blast',
    disabled: true,
  },
  {
    name: 'Fuse',
    disabled: true,
  },
  {
    name: 'BeraChain',
    icon: logoChains.berachain,
    disabled: true,
  },
  {
    name: 'ZetaChain',
    disabled: true,
  },
  {
    name: 'Japan Open Chain',
    icon: customChains.jocChain.icon,
    disabled: true,
  },
  {
    name: 'XRPL EVM Sidechain',
    icon: customChains.xrpLedger.icon,
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
    name: 'Mantle',
    disabled: true,
  },
  {
    name: 'Manta',
    disabled: true,
  },
  {
    name: 'Sui',
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
