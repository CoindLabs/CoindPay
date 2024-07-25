import { _supportChains } from '@/lib/chains'
import { env } from '@/lib/types/env'

let mainnet = env?.isProd

export const getSolanaRPCUrl = ({ type = 'https' } = {}) => {
  switch (type) {
    case 'wss':
      return mainnet
        ? `wss://solana-mainnet.g.alchemy.com/v2/${env?.alchemyId}`
        : `wss://solana-devnet.g.alchemy.com/v2/${env?.alchemyId}`

      break
    case 'https':
    default:
      return mainnet
        ? `https://solana-mainnet.g.alchemy.com/v2/${env?.alchemyId}`
        : `https://solana-devnet.g.alchemy.com/v2/${env?.alchemyId}`
      break
  }
}

export const getActiveChain = ({ name = null, chainId = null }) => {
  if (!name && !chainId) return
  return {
    icon:
      _supportChains.find(row => (name && name == row?.name) || (chainId && chainId == row?.chain?.id))?.icon ||
      `https://icons.llamao.fi/icons/chains/rsz_${((name && name?.split(' ')[0]) || (chainId && _supportChains.find(row => chainId == row?.chain?.id)?.name))?.toLowerCase()}?w=100&h=100`,
  }
}
