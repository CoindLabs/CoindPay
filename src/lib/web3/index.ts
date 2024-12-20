import { _supportChains } from '@/lib/chains'
import { getCompareIgnoreCase, getIncludesIgnoreCase } from '@/lib/utils'
import { env } from '@/lib/types/env'
import { Mainnet } from '@/lib/utils/env'

export const getSvmRpcUrl = ({ chain = 'sol', type = 'https' } = {}) => {
  switch (chain) {
    case 'soon':
      return Mainnet ? 'https://rpc.testnet.soo.network/rpc' : 'https://rpc.devnet.soo.network/rpc'
      break
    case 'sol':
    default:
      return Mainnet
        ? `${type}://solana-mainnet.g.alchemy.com/v2/${env?.alchemyId}`
        : `${type}://solana-devnet.g.alchemy.com/v2/${env?.alchemyId}`
      break
  }
}

export const getActiveChain = ({ name = null, chainId = null }) => {
  if (!name && !chainId) return
  return {
    icon:
      _supportChains().find(
        row =>
          (name && (getCompareIgnoreCase(name, row?.name) || getIncludesIgnoreCase(name, row?.name))) ||
          (chainId && chainId == row?.chain?.id)
      )?.icon ||
      `https://icons.llamao.fi/icons/chains/rsz_${((name && name?.split(' ')[0]) || (chainId && _supportChains().find(row => chainId == row?.chain?.id)?.name))?.toLowerCase()}?w=100&h=100`,
  }
}
