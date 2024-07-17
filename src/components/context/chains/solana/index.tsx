import React, { FC, ReactNode, useEffect, useMemo, useState, useCallback } from 'react'
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import type { Adapter, WalletError } from '@solana/wallet-adapter-base'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SafePalWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { getSolanaRPCUrl } from '@/lib/web3'
import { env } from '@/lib/types/env'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')

let mainnet = env?.isProd

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // If window exists and is on localhost, choose devnet, else choose mainnet
  // const network = 'https://example.solana-devnet.quiknode.pro/00000000000/';

  const network = mainnet ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet

  const endpoint = getSolanaRPCUrl()

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new SafePalWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export const SolanaContextProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <WalletContextProvider>{children}</WalletContextProvider>
)
