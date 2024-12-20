/**
 * wagmi/chains目前还不支持的新链配置
 */
export const customChains = {
  hashkey: {
    id: 177,
    name: 'HashKey',
    icon: 'https://bafybeicyfcitfukfxqe5xtbtn2gb7y2ddyatc4es6skq4kemrqbjjrghkm.ipfs.w3s.link/hsk.png',
    nativeCurrency: {
      decimals: 18,
      name: 'HSK',
      symbol: 'HSK',
    },
    rpcUrls: {
      default: { http: ['https://mainnet.hsk.xyz'] },
    },
    blockExplorers: {
      default: {
        name: 'Hashkey Chain',
        url: 'https://explorer.hsk.xyz',
      },
    },
  },
}
