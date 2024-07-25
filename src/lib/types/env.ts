export const env = {
  moralisKey: process.env.MORALIS_KEY,
  alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  serverAlchemyId: process.env.SERVER_ALCHEMY_ID,
  officialEvmRecipient: process.env.NEXT_PUBLIC_OFFICIAL_EVM_RECEIPT,
  officialSolRecipient: process.env.NEXT_PUBLIC_OFFICIAL_SOL_RECEIPT,
  mockWalletAddress: process.env.NEXT_PUBLIC_LOCAL_MOCK_WALLET_ADDRESS,
  payChainId: Number(process.env.NEXT_PUBLIC_SBT_CHAIN_ID),
  sbtBillingDate: process.env.NEXT_PUBLIC_SBT_BILLING_COUNTDOWN,
  simplehashKey: process.env.SIMPLEHASH_KEY,
  blockVisionBSCKey: process.env.NEXT_PUBLIC_BLOCKVISION_BSC_KEY,
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
  previewVersion: process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview',
  domainLength: process.env.NEXT_PUBLIC_DOMAIN_USERNAME_LENGTH || 8,
  reservedFirstNames: process.env.NEXT_PUBLIC_FIRST_RESERVED_NAMES,
  reservedRouteNames: process.env.NEXT_PUBLIC_ROUTE_RESERVED_NAMES,
  verifiedNames: process.env.NEXT_PUBLIC_VERIFIED_NAMES,
  walletConnectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  iframelyKey: process.env.NEXT_PUBLIC_IFRAMELY_KEY,
  authSecret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  avatarTotal: Number(process.env.NEXT_PUBLIC_AVATAR_TOTAL),
  principalKey: process.env.NEXT_PUBLIC_PRINCIPAL_KEY,
  parseProof: process.env.NEXT_PUBLIC_PARSEP_PROOF,
}
