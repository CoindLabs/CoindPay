/**
 * NFT simplehash服务支持chains, 手动维护，不定期更新
 * docs https://docs.simplehash.com/reference/chains
 */
export const nftAvailableChains = [
  {
    chain: 'align-testnet',
    id: 472382,
    is_testnet: true,
  },
  {
    chain: 'anomaly-andromeda-testnet',
    id: 241120,
    is_testnet: true,
  },
  {
    chain: 'arbitrum',
    id: 42161,
    is_testnet: false,
  },
  {
    chain: 'arbitrum-nova',
    id: 42170,
    is_testnet: false,
  },
  {
    chain: 'arbitrum-sepolia',
    id: 421614,
    is_testnet: true,
  },
  {
    chain: 'avalanche',
    id: 43114,
    is_testnet: false,
  },
  {
    chain: 'avalanche-fuji',
    id: 43113,
    is_testnet: true,
  },
  {
    chain: 'b3-sepolia',
    id: 1993,
    is_testnet: true,
  },
  {
    chain: 'base',
    id: 8453,
    is_testnet: false,
  },
  {
    chain: 'base-sepolia',
    id: 84532,
    is_testnet: true,
  },
  {
    chain: 'bitcoin',
    id: null,
    is_testnet: false,
  },
  {
    chain: 'blast',
    id: 81457,
    is_testnet: false,
  },
  {
    chain: 'blast-sepolia',
    id: 168587773,
    is_testnet: true,
  },
  {
    chain: 'bsc',
    id: 56,
    is_testnet: false,
  },
  {
    chain: 'bsc-testnet',
    id: 97,
    is_testnet: true,
  },
  {
    chain: 'camp-testnet',
    id: 90354,
    is_testnet: true,
  },
  {
    chain: 'canto',
    id: 7700,
    is_testnet: false,
  },
  {
    chain: 'celo',
    id: 42220,
    is_testnet: false,
  },
  {
    chain: 'degen',
    id: 666666666,
    is_testnet: false,
  },
  {
    chain: 'ethereum',
    id: 1,
    is_testnet: false,
  },
  {
    chain: 'ethereum-sepolia',
    id: 11155111,
    is_testnet: true,
  },
  {
    chain: 'fantom',
    id: 250,
    is_testnet: false,
  },
  {
    chain: 'flow',
    id: null,
    is_testnet: false,
  },
  {
    chain: 'flow-evm-previewnet',
    id: 646,
    is_testnet: true,
  },
  {
    chain: 'flow-evm-testnet',
    id: 545,
    is_testnet: true,
  },
  {
    chain: 'forma',
    id: 984122,
    is_testnet: false,
  },
  {
    chain: 'gnosis',
    id: 100,
    is_testnet: false,
  },
  {
    chain: 'godwoken',
    id: 71402,
    is_testnet: false,
  },
  {
    chain: 'godwoken-testnet',
    id: 71401,
    is_testnet: true,
  },
  {
    chain: 'immutable-zkevm',
    id: 13371,
    is_testnet: false,
  },
  {
    chain: 'immutable-zkevm-testnet',
    id: 13473,
    is_testnet: true,
  },
  {
    chain: 'lens-sepolia',
    id: 37111,
    is_testnet: true,
  },
  {
    chain: 'linea',
    id: 59144,
    is_testnet: false,
  },
  {
    chain: 'loot',
    id: 5151706,
    is_testnet: false,
  },
  {
    chain: 'manta',
    id: 169,
    is_testnet: false,
  },
  {
    chain: 'mode',
    id: 34443,
    is_testnet: false,
  },
  {
    chain: 'moonbeam',
    id: 1284,
    is_testnet: false,
  },
  {
    chain: 'opbnb',
    id: 204,
    is_testnet: false,
  },
  {
    chain: 'optimism',
    id: 10,
    is_testnet: false,
  },
  {
    chain: 'optimism-sepolia',
    id: 11155420,
    is_testnet: true,
  },
  {
    chain: 'palm',
    id: 11297108109,
    is_testnet: false,
  },
  {
    chain: 'palm-testnet',
    id: 11297108099,
    is_testnet: true,
  },
  {
    chain: 'poap',
    id: 100,
    is_testnet: false,
  },
  {
    chain: 'polygon',
    id: 137,
    is_testnet: false,
    currency: 'matic',
  },
  {
    chain: 'polygon-amoy',
    id: 80002,
    is_testnet: true,
    currency: 'matic',
  },
  {
    chain: 'polygon-zkevm',
    id: 1101,
    is_testnet: false,
    currency: 'matic',
  },
  {
    chain: 'proof-of-play',
    id: 70700,
    is_testnet: false,
  },
  {
    chain: 'proof-of-play-barret',
    id: 70800,
    is_testnet: true,
  },
  {
    chain: 'proof-of-play-boss',
    id: 70701,
    is_testnet: false,
  },
  {
    chain: 'rari',
    id: 1380012617,
    is_testnet: false,
  },
  {
    chain: 'rari-testnet',
    id: 1918988905,
    is_testnet: true,
  },
  {
    chain: 'scroll',
    id: 534352,
    is_testnet: false,
  },
  {
    chain: 'scroll-sepolia',
    id: 534351,
    is_testnet: true,
  },
  {
    chain: 'sei',
    id: 1329,
    is_testnet: false,
  },
  {
    chain: 'sei-atlantic-2',
    id: 1328,
    is_testnet: true,
  },
  {
    chain: 'shape-sepolia',
    id: 11011,
    is_testnet: true,
  },
  {
    chain: 'shardeum-atomium',
    id: 8082,
    is_testnet: true,
  },
  {
    chain: 'solana',
    id: null,
    is_testnet: false,
  },
  {
    chain: 'solana-devnet',
    id: null,
    is_testnet: true,
  },
  {
    chain: 'solana-testnet',
    id: null,
    is_testnet: true,
  },
  {
    chain: 'story-testnet',
    id: 1513,
    is_testnet: true,
  },
  {
    chain: 'superseed-sepolia',
    id: 53302,
    is_testnet: true,
  },
  {
    chain: 'tezos',
    id: null,
    is_testnet: false,
  },
  {
    chain: 'tezos-ghostnet',
    id: null,
    is_testnet: true,
  },
  {
    chain: 'utxo',
    id: null,
    is_testnet: false,
  },
  {
    chain: 'xai',
    id: 660279,
    is_testnet: false,
  },
  {
    chain: 'xai-sepolia',
    id: 37714555429,
    is_testnet: true,
  },
  {
    chain: 'zero-sepolia',
    id: 4457845,
    is_testnet: true,
  },
  {
    chain: 'zksync-era',
    id: 324,
    is_testnet: false,
  },
  {
    chain: 'zora',
    id: 7777777,
    is_testnet: false,
  },
  {
    chain: 'zora-sepolia',
    id: 999999999,
    is_testnet: true,
  },
]

export const simplehashChains = id => nftAvailableChains.find(row => row.id == id)?.chain
