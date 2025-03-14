import config from '@/config'

const { domains } = config

/**
 * 部分chains自定义logo
 */
export const logoChains = {
  btc: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png',
  base: `${domains.cdn}/static/social/base.svg`,
  berachain: 'https://docs.berachain.com/assets/BERA.png',
  zksync: `${domains.cdn}/static/social/zkSync.svg`,
  linea: `${domains.cdn}/static/social/linea.jpg`,
  solana: `${domains.cdn}/static/social/solana.svg`,
  solana_bg: 'https://cryptofonts.com/img/icons/sol.svg',
  metis: `${domains.cdn}/static/social/metis.svg`,
  metis_text:
    'https://cdn.prod.website-files.com/6507242ad3e4e6ff563301e4/65456c172e9dc496fcde8ca4_main%20Logotype.svg',
  sei: 'https://cdn.sei.io/assets/Sei_Symbol_Gradient.svg',
  gnosis: 'https://docs.tenderly.co/images/networks/gnosis.webp',
  blast: `${domains.cdn}/static/social/mode.svg`,
  scroll: `${domains.cdn}/static/social/scroll.svg`,
  mantle: `${domains.cdn}/static/social/mantle.svg`,
  manta: `${domains.cdn}/static/social/manta.svg`,
  mode: `${domains.cdn}/static/social/mode.svg`,
  fuse: `${domains.cdn}/static/social/fuse.svg`,
  zeta: `${domains.cdn}/static/social/zeta.svg`,
  soon: `${domains.cdn}/static/social/soon.svg`,
  soon_flat: `${domains.cdn}/static/social/soon_flat.svg`,
  soon_text: `${domains.cdn}/static/social/soon_text.svg`,
  hashkey: 'https://bafybeicyfcitfukfxqe5xtbtn2gb7y2ddyatc4es6skq4kemrqbjjrghkm.ipfs.w3s.link/hsk.png',
  taiko:
    'https://static.debank.com/image/eth_token/logo_url/0x10dea67478c5f8c5e2d90e5e9b26dbe60c54d800/2f88b2a5e9d4156b721b5e657a01059e.png',
  rootstock: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/rootstock.svg',
  boba: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/boba.png',
  aurora: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/aurora.png',
  moonriver: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/moonriver.svg',
  moonbeam: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/moonbeam.svg',
  polygonzkevm: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/zkevm.png',
  arbitrum: 'https://cryptofonts.com/img/icons/arb.svg',
  optimism: `${domains.cdn}/static/social/op.svg`,
  fantom: 'https://cryptologos.cc/logos/thumbs/fantom.png',
  celo: `${domains.cdn}/static/social/celo.jpg`,
  avax: 'https://cryptofonts.com/img/icons/avax.svg',
  bnb: 'https://cryptofonts.com/img/icons/bnb.svg',
  polygon: 'https://cryptologos.cc/logos/thumbs/polygon.png',
  icp: `${domains.cdn}/static/social/icp.svg`,
  aptos: 'https://cryptofonts.com/img/icons/apt.svg',
  ton: 'https://cryptofonts.com/img/icons/ton.svg',
  starknet: `${domains.cdn}/static/social/starknet.svg`,
  osmosis: 'https://cryptologos.cc/logos/thumbs/osmosis.png',
  sui: 'https://cryptologos.cc/logos/thumbs/sui.png',
  flow: 'https://cryptofonts.com/img/icons/flow.svg',
  cardano: 'https://cryptofonts.com/img/icons/ada.svg',
  near: 'https://cryptologos.cc/logos/thumbs/near-protocol.png',
  eos: 'https://cryptofonts.com/img/icons/eos.svg',
  tezos: 'https://cryptofonts.com/img/icons/xtz.svg',
  injective: 'https://cryptofonts.com/img/icons/inj.svg',
}

export const logoTokens = {
  usdt: 'https://cryptofonts.com/img/SVG/usdt.svg',
  usdc: 'https://bridge.base.org/icons/currency/usdc.svg',
  eth: 'https://bridge.base.org/icons/currency/eth.svg',
  dai: 'https://bridge.base.org/icons/currency/dai.svg',
  doge: 'https://cryptologos.cc/logos/thumbs/dogecoin.png',
  jupiter: 'https://cryptologos.cc/logos/jupiter-ag-jup-logo.svg',
  lifi: 'https://li.fi/logo192.png',
  lido: `${domains.cdn}/static/social/lido.png`,
  compound: `${domains.cdn}/static/social/compound.png`,
  aave: `${domains.cdn}/static/social/aave.png`,
  maker: `${domains.cdn}/static/social/maker.png`,
}
