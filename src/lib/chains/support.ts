import {
  mainnet,
  base,
  optimism,
  bsc,
  polygon,
  arbitrum,
  avalanche,
  manta,
  mantle,
  sei,
  linea,
  gnosis,
  metis,
  zkSync,
  blast,
  scroll,
  mode,
  fuse,
  rootstock,
  boba,
  aurora,
  moonbeam,
  moonriver,
  zetachain,
  celo,
  fantom,
  polygonZkEvm,
  berachainTestnetbArtio,
} from 'viem/chains'
import { logoChains } from './logo'
import { customChains } from './custom'

export const supportChains = [
  {
    type: 'Non-EVM',
    desc: 'Fast and low-cost Non-EVM（Ethereum Virtual Machine） Chains.',
    list: [
      {
        name: 'ICP',
        icon: logoChains.icp,
      },
      {
        name: 'Solana',
        icon: 'https://cryptofonts.com/img/icons/sol.svg',
      },
      {
        name: 'Bitcoin',
        icon: logoChains.btc,
        disabled: true,
      },
      {
        name: 'TON',
        icon: logoChains.ton,
        disabled: true,
      },
      {
        name: 'Sui',
        icon: logoChains.sui,
        disabled: true,
      },
      {
        name: 'Aptos',
        icon: logoChains.aptos,
        disabled: true,
      },
      {
        name: 'Starknet',
        icon: logoChains.starknet,
        disabled: true,
      },
      {
        name: 'Cardano',
        icon: logoChains.cardano,
        disabled: true,
      },
      {
        name: 'Near',
        icon: logoChains.near,
        disabled: true,
      },
      {
        name: 'Injective',
        icon: logoChains.injective,
        disabled: true,
      },
    ],
  },
  {
    type: 'EVM',
    desc: 'Blockchain network compatible with Ethereum Virtual Machine (EVM).',
    list: [
      {
        name: 'Ethereum',
        icon: 'https://cryptofonts.com/img/icons/aeth.svg',
        chain: mainnet,
      },
      {
        name: 'Base',
        icon: logoChains.base,
        chain: base,
      },
      {
        name: 'Optimism',
        chain: optimism,
        icon: logoChains.optimism,
      },
      {
        name: 'Arbitrum',
        chain: arbitrum,
        icon: logoChains.arbitrum,
      },

      {
        name: 'Fuse',
        chain: fuse,
      },
      {
        name: 'Aurora',
        chain: aurora,
        icon: logoChains.aurora,
      },
      {
        name: 'BSC',
        chain: bsc,
        icon: logoChains.bnb,
      },
      {
        name: 'Polygon',
        chain: polygon,
        icon: logoChains.polygon,
      },
      {
        name: 'zkSync',
        chain: zkSync,
        icon: logoChains.zksync,
      },
      {
        name: 'Sei',
        chain: sei,
        icon: logoChains.sei,
      },
      {
        name: 'Avalanche',
        chain: avalanche,
        icon: logoChains.avax,
      },
      {
        name: 'Mantle',
        chain: mantle,
        icon: logoChains.mantle,
      },
      {
        name: 'Gnosis',
        chain: gnosis,
        icon: logoChains.gnosis,
      },
      {
        name: 'Metis',
        chain: metis,
        icon: logoChains.metis,
      },
      {
        name: 'Linea',
        chain: linea,
      },
      {
        name: 'Manta',
        chain: manta,
      },
      {
        name: 'Blast',
        chain: blast,
      },
      {
        name: 'Scroll',
        chain: scroll,
      },
      {
        name: 'Mint',
        chain: customChains.Mint,
        icon: customChains.Mint.icon,
      },
      {
        name: 'Mode',
        chain: mode,
      },
      {
        name: 'Rootsock',
        chain: rootstock,
        icon: logoChains.rootstock,
      },
      {
        name: 'Boba',
        chain: boba,
        icon: logoChains.boba,
      },
      {
        name: 'Moonbeam',
        chain: moonbeam,
        icon: logoChains.moonbeam,
      },
      {
        name: 'Moonriver',
        chain: moonriver,
        icon: logoChains.moonriver,
      },
      {
        name: 'Celo',
        chain: celo,
      },
      {
        name: 'Fantom',
        chain: fantom,
        icon: logoChains.fantom,
      },
      {
        name: 'Polygon zkEVM',
        chain: polygonZkEvm,
      },
      {
        name: 'Berachain',
        chain: berachainTestnetbArtio,
        icon: logoChains.berachain,
      },
      {
        name: 'ZetaChain',
        chain: zetachain,
      },
      {
        name: 'Japan Open Chain',
        chain: customChains.jocChain,
        icon: customChains.jocChain.icon,
      },
      {
        name: 'XRPL EVM Sidechain',
        chain: customChains.xrpLedger,
        icon: customChains.xrpLedger.icon,
      },
      {
        name: 'Xenea',
        chain: customChains.Xenea,
        icon: customChains.Xenea.icon,
      },
    ],
  },
  {
    type: 'Rollup',
    desc: 'A layer two (L2) blockchain that processes transactions away from the main blockchain to reduce transaction costs and increase throughput on the main chain.',
    list: [
      {
        name: 'Optimism',
        icon: logoChains.optimism,
        chain: optimism,
      },
      {
        name: 'Base',
        icon: logoChains.base,
        chain: base,
      },
      {
        name: 'Arbitrum',
        icon: logoChains.arbitrum,
        chain: arbitrum,
      },
      {
        name: 'Mantle',
        icon: logoChains.mantle,
        chain: mantle,
      },
      {
        name: 'Linea',
        chain: linea,
      },
      {
        name: 'Manta',
        chain: manta,
      },
      {
        name: 'Blast',
        chain: blast,
      },
      {
        name: 'Scroll',
        chain: scroll,
      },
      {
        name: 'zkSync',
        chain: zkSync,
        icon: logoChains.zksync,
      },
      {
        name: 'Mode',
        chain: mode,
      },
      {
        name: 'Metis',
        icon: logoChains.metis,
        chain: metis,
      },
    ],
  },
]

export const _supportChains = supportChains.reduce((accumulator, { type, list }) => {
  return list ? [...accumulator, ...list] : accumulator
}, [])
