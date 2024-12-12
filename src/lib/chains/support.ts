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
  zksync,
  blast,
  scroll,
  mode,
  fuse,
  rootstock,
  boba,
  taiko,
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

const { hashkey } = customChains

export const supportChains = [
  {
    type: 'SVM',
    desc: 'Fast and low-cost SVM（Solana Virtual Machine）',
    list: [
      {
        name: 'SOON',
        icon: logoChains.soon_flat,
        avatarClass: 'bg-black',
      },
      {
        name: 'Solana',
        icon: logoChains.solana_bg,
      },
    ],
  },
  {
    type: 'EVM',
    desc: 'Blockchain network compatible with Ethereum Virtual Machine (EVM)',
    list: [
      {
        name: 'Ethereum',
        icon: 'https://cryptofonts.com/img/icons/aeth.svg',
        chain: mainnet,
      },
      {
        name: 'Metis',
        chain: metis,
        icon: logoChains.metis,
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
        name: 'Sei',
        chain: sei,
        icon: logoChains.sei,
      },
      {
        name: 'Scroll',
        chain: scroll,
      },
      {
        name: 'Celo',
        chain: celo,
      },
      {
        name: 'Gnosis',
        chain: gnosis,
        icon: logoChains.gnosis,
      },
      {
        name: 'Fuse',
        chain: fuse,
      },
      {
        name: 'Boba',
        chain: boba,
        icon: logoChains.boba,
      },
      {
        name: 'Taiko',
        chain: taiko,
      },
      {
        name: 'Aurora',
        chain: aurora,
        icon: logoChains.aurora,
      },
      {
        name: 'zkSync',
        chain: zksync,
        icon: logoChains.zksync,
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
        name: 'Mode',
        chain: mode,
      },
      {
        name: 'Rootsock',
        chain: rootstock,
        icon: logoChains.rootstock,
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
        name: 'Fantom',
        chain: fantom,
        icon: logoChains.fantom,
      },
      {
        name: 'Polygon zkEVM',
        chain: polygonZkEvm,
      },
      {
        name: 'Hashkey',
        chain: hashkey,
        icon: logoChains.hashkey,
      },
      {
        name: 'Zeta',
        chain: zetachain,
        icon: logoChains.zeta,
      },
      {
        name: 'Berachain',
        chain: berachainTestnetbArtio,
        icon: logoChains.berachain,
      },
    ],
  },
  {
    type: 'Others',
    desc: 'Non-EVM（SVM）Chains',
    list: [
      {
        name: 'ICP',
        icon: logoChains.icp,
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
]

export const _supportChains = (chains = null) =>
  (chains || supportChains).reduce((accumulator, { type, list }) => {
    return list ? [...accumulator, ...list] : accumulator
  }, [])
