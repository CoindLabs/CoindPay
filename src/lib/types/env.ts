export const env = {
  moralisKey: process.env.MORALIS_KEY,
  alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  serverAlchemyId: process.env.SERVER_ALCHEMY_ID,
  rpc1Key: process.env.NEXT_PUBLIC_1RPC_KEY,
  thirdwebKey: process.env.NEXT_PUBLIC_THIRDWEB_API_KEY,
  officialEvmRecipient: process.env.NEXT_PUBLIC_OFFICIAL_EVM_RECEIPT,
  officialSolRecipient: process.env.NEXT_PUBLIC_OFFICIAL_SOL_RECEIPT,
  mockWalletAddress: process.env.NEXT_PUBLIC_LOCAL_MOCK_WALLET_ADDRESS,
  payChainId: Number(process.env.NEXT_PUBLIC_SBT_CHAIN_ID),
  simplehashKey: process.env.SIMPLEHASH_KEY,
  awsCDN: process.env.NEXT_PUBLIC_AWS_CDN.endsWith('/')
    ? process.env.NEXT_PUBLIC_AWS_CDN
    : `${process.env.NEXT_PUBLIC_AWS_CDN}/`,
  nftscanAPIKey: process.env.NFTSCAN_API_KEY,
  poapAPIKey: process.env.POAP_API_KEY,
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  isProd:
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
    ['prod', 'pre'].includes(process.env.BRANCH_NAME) ||
    global?.window?.location?.host?.includes?.('pre.coindpay.xyz'),
  isOnline: process.env.NEXT_PUBLIC_VERCEL_ENV !== 'development',
  walletConnectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  iframelyKey: process.env.NEXT_PUBLIC_IFRAMELY_KEY,
  avatarTotal: Number(process.env.NEXT_PUBLIC_AVATAR_TOTAL),
}
