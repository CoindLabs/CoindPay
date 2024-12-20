export const env = {
  alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  serverAlchemyId: process.env.SERVER_ALCHEMY_ID,
  rpc1Key: process.env.NEXT_PUBLIC_1RPC_KEY,
  thirdwebKey: process.env.NEXT_PUBLIC_THIRDWEB_API_KEY,
  officialEvmRecipient: process.env.NEXT_PUBLIC_OFFICIAL_EVM_RECEIPT,
  officialSolRecipient: process.env.NEXT_PUBLIC_OFFICIAL_SOL_RECEIPT,
  mockWalletAddress: process.env.NEXT_PUBLIC_LOCAL_MOCK_WALLET_ADDRESS,
  awsCDN: process.env.NEXT_PUBLIC_AWS_CDN.endsWith('/')
    ? process.env.NEXT_PUBLIC_AWS_CDN
    : `${process.env.NEXT_PUBLIC_AWS_CDN}/`,
  gaId: process.env.NEXT_PUBLIC_GA_ID,

  isDev: process.env.NEXT_PUBLIC_VERCEL_ENV == 'development' || process.env.NODE_ENV == 'development',
  isPreview: process.env.NEXT_PUBLIC_VERCEL_ENV == 'preview',
  isProd: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production',

  walletConnectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  iframelyKey: process.env.NEXT_PUBLIC_IFRAMELY_KEY,
  avatarTotal: Number(process.env.NEXT_PUBLIC_AVATAR_TOTAL),
}
