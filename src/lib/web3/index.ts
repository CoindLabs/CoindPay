import { isAddress } from 'viem'
import { PublicKey } from '@solana/web3.js'
import { _supportChains, chainIdToNetWork, nftAvailableChains } from '@/lib/chains'
import { getCompareIgnoreCase, getIncludesIgnoreCase } from '@/lib/utils'
import { isAlpha, isDevnet } from '@/lib/utils/env'
import { env } from '@/lib/types/env'

/**
 *
 * @param type * nft（nft详情页）scan（浏览器主页）address（账户页）
 * @param chainId * 请求链id 参考 wagmi/chains
 * @param contractAddress * 合约地址
 * @param tokenId * 当前nft数据
 * @param hash * 当请求为测试网的数据时，需要获取交易哈希
 * @returns string 返回opensea或者是etherscan地址 如果是测试网，则etherscan不能查看详情页，只能查看交易数据
 */
interface INFTOrScanUrlProps {
  type?: string
  chain?: string
  chainId?: number
  chainType?: string
  address?: string
  explorer?: boolean
  contractAddress?: string
  tokenId?: string | number
  hash?: string
  options?: object
}

export const getNFTOrScanUrl = ({
  type = 'nft',
  chain = 'ethereum',
  chainId,
  chainType = 'evm',
  address = '',
  contractAddress,
  explorer = false, // 是否用对应链默认浏览器
  tokenId,
  hash = '',
  ...options
}: INFTOrScanUrlProps): string => {
  let _item = nftAvailableChains.find(row => row.chain == chain?.toLowerCase()),
    _chainId = Number(chainId || _item?.id),
    _chainCurrency = _item?.['currency'],
    _svm = chainType == 'svm',
    _sol = chainType == 'sol' || chain?.toLowerCase()?.startsWith('sol'),
    _solExplorer = isDevnet ? '?cluster=devnet' : '',
    _soon = chainType == 'soon' || chain?.toLowerCase()?.startsWith('soon'),
    _icp = chainType == 'icp'

  switch (type) {
    case 'scan':
      if (_svm || _sol) return `https://solscan.io${_solExplorer}`
      if (_soon) return getSoonExplorerUrl()
      return `${chainIdToNetWork(_chainId).blockExplorers?.default?.url}/nft/${contractAddress}/${tokenId}`
      break

    case 'tx':
      if (_svm || _sol) return `https://solscan.io/tx/${hash}${_solExplorer}`
      if (_soon) return `${getSoonExplorerUrl()}/tx/${hash}`
      return `${chainIdToNetWork(_chainId).blockExplorers?.default?.url}/tx/${hash}`
      break

    case 'address':
      if (_svm || _sol) return `https://solscan.io/account/${contractAddress || address}${_solExplorer}`
      if (_soon)
        return explorer
          ? `${getSoonExplorerUrl()}/address/${contractAddress || address}`
          : `${location?.origin}/wallet/${contractAddress || address}`
      if (_icp) return `https://dashboard.internetcomputer.org/account/${address}`
      return `${chainIdToNetWork(_chainId).blockExplorers?.default?.url}/address/${address}`
      break

    case 'block':
      if (_svm || _sol) return `https://solscan.io/block/${hash}${_solExplorer}`
      if (_soon) return `${getSoonExplorerUrl()}/block/${hash}`
      break

    case 'nft':
      if (_svm || _sol || _soon) return `https://magiceden.io/item-details/${contractAddress}`
      return `https://opensea.io/assets/${_chainCurrency || chain}/${contractAddress}/${tokenId}`
      break

    default:
      return null
  }
}

export const getSoonDexUrl = () => {
  return isDevnet
    ? 'https://bridge.devnet.soo.network/home'
    : isAlpha
      ? 'https://bridge.testnet.soo.network/home'
      : 'https://cometbridge.app/?original=Arbitrum&target=Soon%20Mainnet&symbol=ETH&ref=0xA3c0D106E54Ba5B0bA7841ae5A47D7fF0A691331'
}

export const getSoonExplorerUrl = () => {
  return isDevnet
    ? 'https://explorer.devnet.soo.network'
    : isAlpha
      ? 'https://explorer.testnet.soo.network'
      : 'https://explorer.soo.network'
}

export const getSvmRpcUrl = ({ chain = 'sol', ENV = null } = {}) => {
  switch (chain) {
    case 'soon':
      if (ENV) return `https://rpc.${ENV}.soo.network/rpc`
      return isDevnet
        ? 'https://rpc.devnet.soo.network/rpc'
        : isAlpha
          ? 'https://rpc.testnet.soo.network/rpc'
          : 'https://rpc.mainnet.soo.network/rpc'
      break
    case 'sol':
    default:
      if (ENV) return `https://solemn-red-lambo.solana-${ENV}.quiknode.pro/${env?.quicknodeId}`
      return isDevnet
        ? `https://solemn-red-lambo.solana-devnet.quiknode.pro/${env?.quicknodeId}`
        : `https://solemn-red-lambo.solana-mainnet.quiknode.pro/${env?.quicknodeId}`
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

export const getIdentifyPathType = path => {
  // EVM address
  if (isAddress(path)) {
    return 'evm'
  }

  // SVM (Solana address)
  try {
    const publicKey = new PublicKey(path)
    // Checking if the publicKey is on the curve (to ensure it's a valid Solana address)
    if (publicKey.toBase58()) {
      return 'svm'
    }
  } catch (error) {
    console.error('SVM address validation failed:', error)
  }

  // Transaction hash (EVM and Solana)
  // EVM: 0x followed by 64 hex characters
  // SVM: Base58 (44 or more characters)
  if (/^0x[a-fA-F0-9]{64}$/.test(path) || /^[1-9A-HJ-NP-Za-km-z]{44,120}$/.test(path)) {
    return 'tx'
  }

  // Payment ID (MongoDB ObjectID format)
  if (/^[0-9a-fA-F]{24}$/.test(path)) {
    return 'id' // Payment ID
  }

  return null
}
