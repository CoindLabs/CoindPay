/**
 * wagmi/chains目前还不支持的新链配置
 */
export const customChains = {
  Xenea: {
    id: 5555,
    name: 'CVC Kura',
    icon: 'https://res.cloudinary.com/travary/image/upload/c_fill,h_400,w_400/v1/prd-akindo-public/communities/icon/DrKGGq2DjSBGzV8W.png',
    nativeCurrency: {
      decimals: 18,
      name: 'XCR Token',
      symbol: 'XCR',
    },
    rpcUrls: {
      default: { http: ['https://rpc-kura.cross.technology'] },
    },
    blockExplorers: {
      default: {
        name: 'CVC Kura',
        url: 'https://testnet.crossvaluescan.com',
      },
    },
    testnet: true,
  },
  xrpLedger: {
    id: 1440002,
    name: 'XRPL EVM Sidechain',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr_ieGxtCaU8ZnZZ3h7QPlyCXLtCWL1vw5LeZruhXwPNzTKS53E1X-cSakUw&s',
    network: 'evm-sidechain',
    nativeCurrency: {
      decimals: 18,
      name: 'XRP',
      symbol: 'XRP',
    },
    rpcUrls: {
      public: { http: ['https://rpc-evm-sidechain.xrpl.org'] },
      default: { http: ['https://rpc-evm-sidechain.xrpl.org'] },
    },
    blockExplorers: {
      etherscan: {
        name: 'XRPL EVM Sidechain Block Explorer',
        url: 'https://evm-sidechain.xrpl.org',
      },
      default: {
        name: 'XRPL EVM Sidechain Block Explore',
        url: 'https://evm-sidechain.xrpl.org',
      },
    },
    contracts: {
      multicall3: {
        address: '0xB2F3994FD5B2CCf1Dc63FC05E01B06d376170F3f',
        blockCreated: 11_907_934,
      },
    },
  },
  jocChain: {
    id: 81,
    name: 'Japan Open Chain',
    icon: 'https://res.cloudinary.com/travary/image/upload/c_fill,h_400,w_400/v1/prd-akindo-public/communities/icon/vjkJJNDZkFZGvAzW3.png',
    nativeCurrency: {
      decimals: 18,
      name: 'Japan Open Chain Token',
      symbol: 'JOC',
    },
    rpcUrls: {
      default: { http: ['https://rpc-1.japanopenchain.org:8545'] },
    },
    blockExplorers: {
      default: {
        name: 'Japan Open Chain',
        url: 'https://explorer.japanopenchain.org',
      },
    },
  },
  Mint: {
    id: 185,
    name: 'Mint',
    icon: 'https://explorer.mintchain.io/assets/configs/network_icon.png',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.mintchain.io'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Mintchain Mainnet explorer',
        url: 'https://explorer.mintchain.io',
      },
    },
  },
}
