import { env } from '@/lib/types/env'

let mainnet = env?.isProd

let solTokens = {
    sol: mainnet ? 'So11111111111111111111111111111111111111112' : '22fh2M7RX8cYiQt8vR4DvAtcqVkpVNofF51g3K8ZwvxH',
    usdc: mainnet ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' : 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
  },
  baseTokens = {
    usdc: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    eth: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    dai: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  },
  zkSyncTokens = {
    usdc: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
    eth: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  opTokens = {
    usdc: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    eth: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    op: '0x4200000000000000000000000000000000000042',
    usdt: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    dai: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
  },
  arbTokens = {
    usdc: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    eth: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    arb: '0x912ce59144191c1204e64559fe8253a0e49e6548',
    usdt: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    dai: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  },
  ethTokens = {
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    eth: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  }

let USDC = {
    symbol: 'USDC',
    name: 'USD Coin',
    logoURI: 'https://bridge.base.org/icons/currency/usdc.svg',
  },
  DAI = {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    logoURI: 'https://bridge.base.org/icons/currency/dai.svg',
  },
  ETH = {
    symbol: 'ETH',
    name: 'Ethereum Coin',
    logoURI: 'https://static.optimism.io/data/ETH/logo.svg',
  },
  USDT = {
    symbol: 'USDT',
    name: 'Tether USD',
    logoURI: 'https://cryptofonts.com/img/SVG/usdt.svg',
  }

let solana = {
    mocks: solTokens,
    list: [
      {
        ...USDC,
        address: solTokens.usdc,
        chainId: 101,
        decimals: 6,
        tags: ['old-registry', 'solana-fm'],
        extensions: {
          coingeckoId: 'usd-coin',
        },
      },
      {
        symbol: 'SOL',
        name: 'Wrapped SOL',
        logoURI:
          'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        address: solTokens.sol,
        chainId: 101,
        decimals: 9,
        tags: ['old-registry'],
        extensions: {
          coingeckoId: 'wrapped-solana',
        },
      },
    ],
  },
  base = {
    mocks: {
      ...baseTokens,
      usdc: {
        mainnet: baseTokens.usdc,
        sepolia: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      },
    },
    list: [
      {
        ...USDC,
        address: baseTokens.usdc,
      },
      {
        ...DAI,
        address: baseTokens.dai,
      },
      {
        symbol: 'USDBC',
        name: 'USD Base Coin',
        logoURI:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
        address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
      },
      {
        ...ETH,
        address: baseTokens.eth,
        eth: true,
      },
      {
        symbol: 'cbETH',
        name: 'Coinbase Wrapped Staked ETH',
        logoURI: 'https://assets.coingecko.com/coins/images/27008/small/cbeth.png',
        address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
      },
      {
        symbol: 'rETH',
        name: 'Rocket Pool ETH',
        logoURI: 'https://basescan.org/token/images/rocketpooleth_32.png',
        address: '0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c',
      },
      {
        symbol: 'COMP',
        name: 'Compound',
        logoURI:
          'https://static.debank.com/image/avax_token/logo_url/0xc3048e19e76cb9a3aa9d77d8c03c29fc906e2437/dd174d3d7083fa027a433dc50edaf0bc.png',
        address: '0x9e1028f5f1d5ede59748ffcee5532509976840e0',
      },
      {
        symbol: 'YFI',
        name: 'yearn.finance',
        logoURI:
          'https://static.debank.com/image/base_token/logo_url/0x9eaf8c1e34f05a589eda6bafdf391cf6ad3cb239/f14ac7f4efe5c51e1c6b32add3dea10c.png',
        address: '0x9eaf8c1e34f05a589eda6bafdf391cf6ad3cb239',
      },
    ],
  },
  zkSync = {
    mocks: {
      ...zkSyncTokens,
      usdc: {
        mainnet: zkSyncTokens.usdc,
        sepolia: '0xAe045DE5638162fa134807Cb558E15A3F5A7F853',
      },
    },
    list: [
      {
        ...USDC,
        address: zkSyncTokens.usdc,
      },
      {
        ...ETH,
        address: zkSyncTokens.eth,
        eth: true,
      },
    ],
  },
  optimism = {
    mocks: {
      ...opTokens,
      usdc: {
        mainnet: opTokens.usdc,
        sepolia: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
      },
    },
    list: [
      {
        ...USDC,
        address: opTokens.usdc,
      },
      {
        ...ETH,
        address: opTokens.eth,
        eth: true,
      },
      {
        symbol: 'OP',
        name: 'Optimism',
        logoURI: 'https://tokens-data.1inch.io/images/0x4200000000000000000000000000000000000042.png',
        address: opTokens.op,
      },
      {
        ...USDT,
        address: opTokens.usdt,
      },
      {
        ...DAI,
        address: opTokens.dai,
      },
    ],
  },
  arbitrum = {
    mocks: {
      ...arbTokens,
      usdc: {
        mainnet: arbTokens.usdc,
        sepolia: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
      },
    },
    list: [
      {
        ...USDC,
        address: arbTokens.usdc,
      },
      {
        ...ETH,
        address: arbTokens.eth,
        eth: true,
      },
      {
        symbol: 'ARB',
        name: 'Arbitrum',
        logoURI: 'https://cryptofonts.com/img/icons/arb.svg',
        address: arbTokens.arb,
      },
      {
        ...USDT,
        address: arbTokens.usdt,
      },
      {
        ...DAI,
        address: arbTokens.dai,
      },
    ],
  },
  ethereum = {
    mocks: {
      ...ethTokens,
      usdc: {
        mainnet: ethTokens.usdc,
        sepolia: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      },
    },
    list: [
      {
        ...USDC,
        address: ethTokens.usdc,
      },
      {
        ...ETH,
        address: ethTokens.eth,
        eth: true,
      },
      {
        ...USDT,
        address: ethTokens.usdt,
      },
      {
        ...DAI,
        address: ethTokens.dai,
      },
    ],
  }

export { solana, base, zkSync, optimism, arbitrum, ethereum }
