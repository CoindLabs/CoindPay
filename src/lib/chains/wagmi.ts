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
  zksync,
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
  bscTestnet,
  polygonAmoy,
  zksyncSepoliaTestnet,
  berachainTestnetbArtio,
  auroraTestnet,
  fuseSparknet,
  zetachainAthensTestnet,
} from 'viem/chains'
import { env } from '@/lib/types/env'
import { logoChains } from './logo'
import { customChains } from './custom'

import config from '@/config'

const { title } = config

const { hashkey } = customChains

let isProd = env?.isProd

let projectId = env.walletConnectId

const { wallets: defaultWallets } = getDefaultWallets()

const wallets = [
  ...defaultWallets,
  {
    groupName: 'Others',
    wallets: [okxWallet, phantomWallet, uniswapWallet, tokenPocketWallet, trustWallet],
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
  bsc,
  polygon,
  avalanche,
  arbitrum,
  { ...metis, name: 'Metis', iconUrl: logoChains.metis },
  { ...fuse, name: 'Fuse', iconUrl: logoChains.fuse },
  { ...sei, iconUrl: logoChains.sei },
  { ...scroll, iconUrl: logoChains.scroll },
  { ...manta, name: 'Manta', iconUrl: logoChains.manta },
  { ...mantle, iconUrl: logoChains.mantle },
  { ...blast, iconUrl: logoChains.blast },
  { ...gnosis, iconUrl: logoChains.gnosis },
  { ...hashkey, iconUrl: logoChains.hashkey },
  { ...linea, name: 'Linea', iconUrl: logoChains.linea },
  { ...zksync, iconUrl: logoChains.zksync },
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
]

const chains = isProd
  ? chains_tpl
  : [
      ...chains_tpl,
      sepolia,
      baseSepolia,
      optimismSepolia,
      arbitrumSepolia,
      bscTestnet,
      { ...polygonAmoy, iconUrl: logoChains.polygon },
      { ...zksyncSepoliaTestnet, iconUrl: logoChains.zksync },
      { ...auroraTestnet, iconUrl: logoChains.aurora },
      { ...fuseSparknet, iconUrl: logoChains.fuse },
      zetachainAthensTestnet,
    ]

export const chainsTransports = {
  [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${env.alchemyId}`),
  [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${env.alchemyId}`),
  [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${env.alchemyId}`),
  [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${env.alchemyId}`),
  [zksync.id]: http(`https://zksync-mainnet.g.alchemy.com/v2/${env.alchemyId}`),
  [zksyncSepoliaTestnet.id]: http(`https://zksync-sepolia.g.alchemy.com/v2/${env.alchemyId}`),
  [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${env.alchemyId}`),
  [optimismSepolia.id]: http(`https://opt-sepolia.g.alchemy.com/v2/${env.alchemyId}`),
  [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${env.alchemyId}`),
  [arbitrumSepolia.id]: http(`https://arb-sepolia.g.alchemy.com/v2/${env.alchemyId}`),
  [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${env.alchemyId}`),
  [polygonAmoy.id]: http(`https://polygon-amoy.g.alchemy.com/v2/${env.alchemyId}`),
  [bsc.id]: http(`https://56.rpc.thirdweb.com/${env?.thirdwebKey}`),
  [bscTestnet.id]: http(`https://97.rpc.thirdweb.com/${env?.thirdwebKey}`),
  [sei.id]: http(`https://1329.rpc.thirdweb.com/${env?.thirdwebKey}`),
  [gnosis.id]: http(`https://1rpc.io/${env.rpc1Key}/gnosis`),
  [aurora.id]: http(`https://1rpc.io/${env.rpc1Key}/aurora`),
  [auroraTestnet.id]: http(`https://1313161555.rpc.thirdweb.com/${env.thirdwebKey}`),
  [fuse.id]: http(`https://122.rpc.thirdweb.com/${env.thirdwebKey}`),
  [fuseSparknet.id]: http(`https://123.rpc.thirdweb.com/${env.thirdwebKey}`),
  [metis.id]: http(`https://1088.rpc.thirdweb.com/${env.thirdwebKey}`),
  [zetachain.id]: http(`https://7000.rpc.thirdweb.com/${env?.thirdwebKey}`),
  [zetachainAthensTestnet.id]: http(`https://7001.rpc.thirdweb.com/${env?.thirdwebKey}`),
  [hashkey.id]: http('https://hashkeychain-testnet.alt.technology'),
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
