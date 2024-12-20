import { logoChains } from './logo'
import { Mainnet } from '@/lib/utils/env'
import * as pay from './tokens'

import config from '@/config'

const { domains } = config

/**
 * 已开通或即将开通支付的链配置
 */
export const payChains = [
  {
    name: Mainnet ? 'SOON Testnet' : 'SOON Devnet',
    icon: logoChains.soon_flat,
    avatarClass: 'bg-black',
    chainId: 1151111081099710,
    chainIdProd: 1151111081099710,
    type: 'SVM',
    ...pay?.soon,
  },
  {
    name: Mainnet ? 'Solana' : 'Solana Devnet',
    icon: logoChains.solana_bg,
    chainId: 1151111081099710, // 参考 https://docs.li.fi/list-chains-bridges-dex-aggregators-solvers#supported-chains
    chainIdProd: 1151111081099710,
    type: 'SVM',
    ...pay?.solana,
  },
  {
    name: Mainnet ? 'Ethereum' : 'Ethereum Sepolia',
    icon: 'https://cryptofonts.com/img/SVG/cbeth.svg',
    chainId: Mainnet ? 1 : 11155111,
    chainIdProd: 1,
    type: 'EVM',
    ...pay?.ethereum,
  },
  {
    name: Mainnet ? 'Metis' : 'Metis Sepolia',
    icon: logoChains.metis,
    chainId: Mainnet ? 1088 : 59902,
    chainIdProd: 1088,
    type: 'EVM',
    ...pay?.metis,
  },
  {
    name: Mainnet ? 'Base' : 'Base Sepolia',
    icon: logoChains.base,
    chainNamePrice: 'BASE',
    chainId: Mainnet ? 8453 : 84532,
    chainIdProd: 8453,
    type: 'EVM',
    ...pay?.base,
  },
  {
    name: Mainnet ? 'Optimism' : 'Optimism Sepolia',
    icon: logoChains.optimism,
    chainId: Mainnet ? 10 : 11155420,
    chainIdProd: 10,
    type: 'EVM',
    ...pay?.optimism,
  },
  {
    name: Mainnet ? 'Arbitrum' : 'Arbitrum Sepolia',
    icon: logoChains.arbitrum,
    chainId: Mainnet ? 42161 : 421614,
    chainIdProd: 42161,
    type: 'EVM',
    ...pay?.arbitrum,
  },
  {
    name: Mainnet ? 'BSC' : 'BSC Testnet',
    icon: 'https://cryptofonts.com/img/brands/binance.svg',
    chainId: Mainnet ? 56 : 97,
    chainIdProd: 56,
    type: 'EVM',
    ...pay?.bsc,
  },
  {
    name: Mainnet ? 'Polygon' : 'Polygon Amoy Testnet',
    icon: logoChains.polygon,
    chainId: Mainnet ? 137 : 80002,
    chainIdProd: 137,
    type: 'EVM',
    ...pay?.polygon,
  },
  {
    name: Mainnet ? 'zkSync' : 'zkSync Sepolia',
    icon: logoChains.zksync,
    chainId: Mainnet ? 324 : 300,
    chainIdProd: 324,
    type: 'EVM',
    ...pay?.zkSync,
  },
  {
    name: Mainnet ? 'Sei' : 'Sei Testnet',
    icon: logoChains.sei,
    chainId: 1329,
    chainIdProd: 1329,
    type: 'EVM',
    ...pay?.sei,
  },
  {
    name: Mainnet ? 'Scroll' : 'Scroll Sepolia',
    chainId: Mainnet ? 534352 : 534351,
    chainIdProd: 534352,
    type: 'EVM',
    ...pay?.scroll,
  },
  {
    name: Mainnet ? 'Celo' : 'Celo Testnet',
    chainId: Mainnet ? 42220 : 44787,
    chainIdProd: 42220,
    type: 'EVM',
    ...pay?.celo,
  },
  {
    name: Mainnet ? 'Boba' : 'Boba Sepolia',
    icon: logoChains.boba,
    chainId: Mainnet ? 288 : 28882,
    chainIdProd: 288,
    type: 'EVM',
    ...pay?.boba,
  },
  {
    name: Mainnet ? 'Taiko' : 'Taiko Hekla',
    icon: logoChains.taiko,
    chainId: Mainnet ? 167000 : 167009,
    chainIdProd: 167000,
    type: 'EVM',
    ...pay?.taiko,
  },

  {
    name: Mainnet ? 'Gnosis' : 'Gnosis Testnet',
    icon: logoChains.gnosis,
    chainId: Mainnet ? 100 : 10200,
    chainIdProd: 100,
    type: 'EVM',
    ...pay?.gnosis,
  },
  {
    name: Mainnet ? 'Fuse' : 'Fuse Sparknet',
    chainId: Mainnet ? 122 : 123,
    chainIdProd: 122,
    type: 'EVM',
    ...pay?.fuse,
  },
  {
    name: Mainnet ? 'Aurora' : 'Aurora Testnet',
    icon: `${domains.cdn}/static/social/aurora.svg`,
    chainId: Mainnet ? 1313161554 : 1313161555,
    chainIdProd: 1313161554,
    type: 'EVM',
    ...pay?.aurora,
  },
  {
    name: 'Hashkey',
    icon: logoChains.hashkey,
    chainId: 177,
    chainIdProd: 177,
    type: 'EVM',
    ...pay?.hashkey,
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
    name: 'ICP',
    type: 'Others',
    disabled: true,
  },
  {
    name: 'Near',
    type: 'Others',
    disabled: true,
  },
  {
    name: 'Blast',
    type: 'EVM',
    disabled: true,
  },
  {
    name: 'Linea',
    type: 'EVM',
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
    name: Mainnet ? 'Zeta' : 'Zeta Testnet',
    icon: logoChains.zeta,
    chainId: Mainnet ? 7000 : 7001,
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
