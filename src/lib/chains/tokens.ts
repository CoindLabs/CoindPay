import { env } from '@/lib/types/env'
import { logoChains } from './logo'

let mainnet = env?.isProd

let ethTokens = {
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    eth: '0x0000000000000000000000000000000000000000',
    usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  baseTokens = {
    usdc: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    eth: '0x0000000000000000000000000000000000000000',
    dai: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  },
  opTokens = {
    usdc: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    eth: '0x0000000000000000000000000000000000000000',
    op: '0x4200000000000000000000000000000000000042',
    usdt: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    dai: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
  },
  arbTokens = {
    usdc: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    eth: '0x0000000000000000000000000000000000000000',
    arb: '0x912ce59144191c1204e64559fe8253a0e49e6548',
    usdt: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    dai: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  },
  bscTokens = {
    usdc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    bnb: '0x0000000000000000000000000000000000000000',
    dai: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    busd: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    usdt: '0x55d398326f99059fF775485246999027B3197955',
  },
  polygonTokens = {
    usdc: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    pol: '0x0000000000000000000000000000000000000000',
    dai: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },
  zkSyncTokens = {
    usdc: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
    eth: '0x0000000000000000000000000000000000000000',
    zk: '0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E',
    usdt: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
  },
  auroraTokens = {
    usdc: '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802',
    eth: '0x0000000000000000000000000000000000000000',
    aurora: '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79',
    usdt: '0x4988a896b1227218e4A686fdE5EabdcAbd91571f',
    dai: '0xe3520349F477A5F6EB06107066048508498A291b',
  },
  fuseTokens = {
    fuse: '0x0000000000000000000000000000000000000000',
    usdc: '0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5',
    weth: '0xa722c13135930332Eb3d749B2F0906559D2C5b99',
    usdt: '0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10',
    dai: '0x94Ba7A27c7A95863d1bdC7645AC2951E0cca06bA',
  },
  metisTokens = {
    metis: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
    usdc: '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21',
    usdt: '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC',
    dai: '0x4c078361FC9BbB78DF910800A991C7c3DD2F6ce0',
  },
  seiTokens = {
    sei: '0x0000000000000000000000000000000000000000',
    usdc: '0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1',
    usdt: '0xB75D0B03c06A926e488e2659DF1A861F860bD3d1',
    weth: '0x160345fC359604fC6e70E3c5fAcbdE5F7A9342d8',
  },
  scrollTokens = {
    usdc: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
    eth: '0x0000000000000000000000000000000000000000',
    usdt: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df',
    dai: '0xcA77eB3fEFe3725Dc33bccB54eDEFc3D9f764f97',
  },
  gnosisTokens = {
    xdai: '0x0000000000000000000000000000000000000000',
    usdc: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
    usdt: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
    weth: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
  },
  zetaTokens = {
    zeta: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    usdc: '0x0cbe0df132a6c6b4a2974fa1b7fb953cf0cc798a',
    eth: '0xd97b1de3619ed2c6beb3860147e30ca8a7dc9891',
    usdt: '0x7c8dda80bbbe1254a7aacf3219ebe1481c6e01d7',
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
  WETH = {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  USDT = {
    symbol: 'USDT',
    name: 'Tether USD',
    logoURI: 'https://cryptofonts.com/img/SVG/usdt.svg',
  }

let solana = {
    mocks: {
      sol: {
        dev: '22fh2M7RX8cYiQt8vR4DvAtcqVkpVNofF51g3K8ZwvxH',
        mainnet: '11111111111111111111111111111111',
      },
      usdc: {
        dev: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
        mainnet: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      },
    },
    list: [
      {
        ...USDC,
        address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      },
      {
        symbol: 'SOL',
        name: 'Wrapped SOL',
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
        address: '11111111111111111111111111111111',
      },
    ],
  },
  ethereum = {
    mocks: {
      ...ethTokens,
      usdc: {
        mainnet: ethTokens.usdc,
        dev: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
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
        native: true,
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
  },
  base = {
    mocks: {
      ...baseTokens,
      usdc: {
        mainnet: baseTokens.usdc,
        dev: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
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
        ...ETH,
        address: baseTokens.eth,
        native: true,
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
  optimism = {
    mocks: {
      ...opTokens,
      usdc: {
        mainnet: opTokens.usdc,
        dev: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
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
        native: true,
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
        dev: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
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
        native: true,
      },
      {
        symbol: 'ARB',
        name: 'Arbitrum',
        logoURI: logoChains.arbitrum,
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
  bsc = {
    mocks: {
      ...bscTokens,
      usdc: {
        mainnet: bscTokens.usdc,
        dev: '0x64544969ed7EBf5f083679233325356EbE738930',
      },
    },
    list: [
      {
        ...USDC,
        address: bscTokens.usdc,
      },
      {
        symbol: 'BNB',
        name: 'Binance Coin',
        logoURI: 'https://tokens-data.1inch.io/images/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
        address: bscTokens.bnb,
        native: true,
      },
      {
        ...DAI,
        address: bscTokens.dai,
      },
      {
        symbol: 'BUSD',
        name: 'Binance USD',
        logoURI: 'https://tokens-data.1inch.io/images/0x4fabb145d64652a948d72533023f6e7a623c7c53.png',
        address: bscTokens.busd,
      },
      {
        ...USDT,
        address: bscTokens.usdt,
      },
    ],
  },
  polygon = {
    mocks: {
      ...polygonTokens,
      usdc: {
        mainnet: polygonTokens.usdc,
        dev: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
      },
    },
    list: [
      {
        ...USDC,
        address: polygonTokens.usdc,
      },
      {
        symbol: 'POL',
        name: 'Polygon Ecosystem Coin',
        address: polygonTokens.pol,
        logoURI: 'https://static.debank.com/image/matic_token/logo_url/matic/6f5a6b6f0732a7a235131bd7804d357c.png',
        native: true,
      },
      {
        ...DAI,
        address: polygonTokens.dai,
      },
      {
        ...USDT,
        address: polygonTokens.usdt,
      },
    ],
  },
  zkSync = {
    mocks: {
      ...zkSyncTokens,
      usdc: {
        mainnet: zkSyncTokens.usdc,
        dev: '0xAe045DE5638162fa134807Cb558E15A3F5A7F853',
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
        native: true,
      },
      {
        symbol: 'ZK',
        name: 'ZK Coin',
        address: zkSyncTokens.zk,
        logoURI:
          'https://static.debank.com/image/era_token/logo_url/0x5a7d6b2f92c77fad6ccabd7ee0624e64907eaf3e/7edf9f54939170547960eb08d2fa1c63.png',
      },
      {
        ...USDT,
        address: zkSyncTokens.usdt,
      },
    ],
  },
  fuse = {
    mocks: {
      ...fuseTokens,
      usdc: fuseTokens.usdc,
    },
    list: [
      {
        ...USDC,
        address: fuseTokens.usdc,
      },
      {
        symbol: 'FUSE',
        name: 'Fuse Coin',
        address: fuseTokens.fuse,
        logoURI: logoChains.fuse,
        native: true,
      },
      {
        ...WETH,
        address: fuseTokens.weth,
      },
    ],
  },
  aurora = {
    mocks: {
      ...auroraTokens,
      usdc: {
        mainnet: auroraTokens.usdc,
        dev: '0x3dcB6AdF46E4d854E94719b6ed9cfab6939cC1Cb',
      },
    },
    list: [
      {
        ...USDC,
        address: auroraTokens.usdc,
      },
      {
        ...ETH,
        address: auroraTokens.eth,
        native: true,
      },
      {
        symbol: 'AURORA',
        name: 'Aurora Coin',
        address: auroraTokens.aurora,
        logoURI:
          'https://static.debank.com/image/aurora_token/logo_url/0x8bec47865ade3b172a928df8f990bc7f2a3b9f79/ec63b91b7247ce338caa842eb6439530.png',
      },
      {
        ...USDT,
        address: auroraTokens.usdt,
      },
      {
        ...DAI,
        address: auroraTokens.dai,
      },
    ],
  },
  zeta = {
    mocks: {
      ...zetaTokens,
      usdc: zetaTokens.usdc,
    },
    list: [
      {
        symbol: 'ZETA',
        name: 'ZetaChain Coin',
        address: zetaTokens.zeta,
        logoURI: logoChains.zeta,
        native: true,
      },
      {
        ...USDC,
        symbol: 'USDC.ETH',
        name: 'ZRC20 USDC on ETH',
        address: zetaTokens.usdc,
      },
    ],
  },
  metis = {
    mocks: {
      ...metisTokens,
      usdc: metisTokens.usdc,
    },
    list: [
      {
        symbol: 'METIS',
        name: 'Metis Token',
        address: metisTokens.metis,
        logoURI: logoChains.metis,
        native: true,
      },
      {
        ...USDC,
        symbol: 'm.USDC',
        address: metisTokens.usdc,
      },
      {
        ...USDT,
        symbol: 'm.USDT',
        address: metisTokens.usdt,
      },
      {
        ...DAI,
        symbol: 'm.DAI',
        address: metisTokens.dai,
      },
    ],
  },
  sei = {
    mocks: {
      ...seiTokens,
      usdc: seiTokens.usdc,
    },
    list: [
      {
        symbol: 'Sei',
        name: 'Sei Token',
        address: seiTokens.sei,
        logoURI: logoChains.sei,
        native: true,
      },
      {
        ...USDC,
        address: seiTokens.usdc,
      },
      {
        ...USDT,
        address: seiTokens.usdt,
      },
      {
        ...WETH,
        address: seiTokens.weth,
      },
    ],
  },
  gnosis = {
    mocks: {
      ...gnosisTokens,
      usdc: gnosisTokens.usdc,
    },
    list: [
      {
        ...DAI,
        symbol: 'xDAI',
        name: 'xDAI Native Token',
        address: gnosisTokens.xdai,
        native: true,
      },
      {
        ...USDC,
        address: gnosisTokens.usdc,
      },
      {
        ...USDT,
        address: gnosisTokens.usdt,
      },
      {
        ...WETH,
        address: gnosisTokens.weth,
      },
    ],
  },
  scroll = {
    mocks: {
      ...scrollTokens,
      usdc: scrollTokens.usdc,
    },
    list: [
      {
        ...USDC,
        address: scrollTokens.usdc,
      },
      {
        ...ETH,
        address: scrollTokens.eth,
        native: true,
      },
      {
        ...USDT,
        address: scrollTokens.usdt,
      },
      {
        ...DAI,
        address: scrollTokens.dai,
      },
    ],
  }

export {
  solana,
  ethereum,
  base,
  optimism,
  arbitrum,
  bsc,
  polygon,
  zkSync,
  aurora,
  fuse,
  zeta,
  metis,
  sei,
  gnosis,
  scroll,
}
