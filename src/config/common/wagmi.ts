import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import {
  trustWallet,
  phantomWallet,
  uniswapWallet,
  okxWallet,
  ledgerWallet,
  tokenPocketWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { http } from 'wagmi'
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
  sepolia,
  baseSepolia,
  optimismSepolia,
  arbitrumSepolia,
  zkSyncSepoliaTestnet,
  berachainTestnetbArtio,
} from 'wagmi/chains'
import { env } from '@/lib/types/env'
import { customChains, logoChains } from '@/lib/types/chains'

import config from '@/config'

const { title, domains } = config

const { Xenea, xrpLedger, jocChain } = customChains

let isProd = env?.isProd

let projectId = env.walletConnectId

const { wallets: defaultWallets } = getDefaultWallets()

const wallets = [
  ...defaultWallets,
  {
    groupName: 'Others',
    wallets: [phantomWallet, uniswapWallet, tokenPocketWallet, trustWallet, okxWallet],
  },
  {
    groupName: 'Hardware',
    wallets: [ledgerWallet],
  },
]

let chains_tpl = [
  mainnet,
  base,
  optimism,
  polygon,
  bsc,
  avalanche,
  arbitrum,
  { ...manta, name: 'Manta', iconUrl: logoChains.manta },
  { ...mantle, iconUrl: logoChains.mantle },
  { ...blast, iconUrl: logoChains.blast },
  { ...scroll, iconUrl: logoChains.scroll },
  { ...gnosis, iconUrl: logoChains.gnosis },
  { ...sei, iconUrl: logoChains.sei },
  { ...fuse, name: 'Fuse', iconUrl: logoChains.fuse },
  { ...metis, name: 'Metis', iconUrl: logoChains.metis },
  { ...linea, name: 'Linea', iconUrl: logoChains.linea },
  { ...zkSync, iconUrl: logoChains.zksync },
  { ...mode, name: 'Mode', iconUrl: logoChains.mode },
  { ...rootstock, name: 'Rootsock', iconUrl: logoChains.rootstock },
  { ...boba, name: 'Boba', iconUrl: logoChains.boba },
  { ...aurora, name: 'Aurora', iconUrl: logoChains.aurora },
  { ...moonbeam, name: 'Moonbeam', iconUrl: logoChains.moonbeam },
  { ...moonriver, name: 'Moonriver', iconUrl: logoChains.moonriver },
  { ...zetachain, name: 'Zeta' },
  { ...berachainTestnetbArtio, iconUrl: logoChains.berachain },
  { ...celo, iconUrl: logoChains.celo },
  { ...fantom, iconUrl: logoChains.fantom },
  { ...polygonZkEvm, iconUrl: logoChains.polygonzkevm },
  {
    ...jocChain,
    iconUrl: jocChain.icon,
  },
  {
    ...xrpLedger,
    iconUrl: xrpLedger.icon,
  },
  {
    ...Xenea,
    iconUrl: Xenea.icon,
  },
]

const chains = isProd
  ? chains_tpl
  : [
      ...chains_tpl,
      sepolia,
      baseSepolia,
      optimismSepolia,
      arbitrumSepolia,
      { ...zkSyncSepoliaTestnet, iconUrl: logoChains.zksync },
    ]

export const chainsTransports = {
  [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${env.alchemyId}`),
  [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${env.alchemyId}`),
  [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${env.alchemyId}`),
  [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${env.alchemyId}`),
  [zkSync.id]: http(`https://zksync-mainnet.g.alchemy.com/v2/${env.alchemyId}`),
  [zkSyncSepoliaTestnet.id]: http(`https://zksync-sepolia.g.alchemy.com/v2/${env.alchemyId}`),
  [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${env.alchemyId}`),
  [optimismSepolia.id]: http(`https://opt-sepolia.g.alchemy.com/v2/${env.alchemyId}`),
  [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${env.alchemyId}`),
  [arbitrumSepolia.id]: http(`https://arb-sepolia.g.alchemy.com/v2/${env.alchemyId}`),
  [bsc.id]: http(`https://bsc-mainnet.blockvision.org/v1/${env.alchemyId}`),
}

export const wagmiConfig = {
  appName: title,
  projectId,
  chains: chains as any,
  transports: chainsTransports,
  wallets,
  ssr: true,
}

export const wagmiCoreConfig = {
  chains: chains as any,
  transports: chainsTransports,
}
