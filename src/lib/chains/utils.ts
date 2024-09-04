import { Chain } from 'viem'
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
  pulsechain,
  goerli,
  sepolia,
  baseSepolia,
  optimismSepolia,
  arbitrumSepolia,
  bscTestnet,
  polygonAmoy,
  zksyncSepoliaTestnet,
  berachainTestnetbArtio,
  auroraTestnet,
  zetachainAthensTestnet,
} from 'viem/chains'
import { customChains } from './custom'

export const chainIdToNetWork = (chainId: number): Chain => {
  switch (chainId) {
    case 8453:
      return base as any
    case 10:
      return optimism as any
    case 137:
      return polygon as any
    case 56:
      return bsc as any
    case 43114:
      return avalanche as any
    case 42161:
      return arbitrum as any
    case 324:
      return zksync as any
    case 5000:
      return mantle as any
    case 169:
      return manta as any
    case 59144:
      return linea as any
    case 81457:
      return blast as any
    case 34443:
      return mode as any
    case 534352:
      return scroll as any
    case 100:
      return gnosis as any
    case 1329:
      return sei as any
    case 1088:
      return metis as any
    case 7000:
      return zetachain as any
    case 369:
      return pulsechain as any
    case 122:
      return fuse as any
    case 42220:
      return celo as any
    case 250:
      return fantom as any
    case 30:
      return rootstock as any
    case 288:
      return boba as any
    case 1313161554:
      return aurora as any
    case 1284:
      return moonbeam as any
    case 1285:
      return moonriver as any
    case 1101:
      return polygonZkEvm as any

    case 5:
      return goerli as any
    case 11155111:
      return sepolia as any
    case 11155420:
      return optimismSepolia as any
    case 84532:
      return baseSepolia as any
    case 421614:
      return arbitrumSepolia as any
    case 97:
      return bscTestnet as any
    case 80002:
      return polygonAmoy as any
    case 80084:
      return berachainTestnetbArtio
    case 5555:
      return customChains.Xenea as any
    case 1440002:
      return customChains.xrpLedger as any
    case 81:
      return customChains.jocChain as any
    case 300:
      return zksyncSepoliaTestnet as any
    case 1313161555:
      return auroraTestnet as any
    case 7001:
      return zetachainAthensTestnet as any

    case 1:
    default:
      return mainnet as any
  }
}
