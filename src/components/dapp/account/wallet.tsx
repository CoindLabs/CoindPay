import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Avatar, Box, Button, Grid, Typography } from '@mui/material'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAccount, useSwitchChain } from 'wagmi'
import dynamic from 'next/dynamic'
import classNames from 'classnames'
import { GlobalContextProvider } from '@/components/context'
import NmIcon from '@/components/nm-icon'
import NmWallet from '@/components/nm-wallet'
import { labels, ChainsWalletCard } from '@/components/nm-chains-wallet'
import ICPModal from '@/components/dapp/account/icp'
import { useEVMWalletConnect } from '@/lib/hooks'
import { supportChains } from '@/lib/chains'
import { getShortenMidDots } from '@/lib/utils'

import config from '@/config'
import { getActiveChain } from '@/lib/web3'

const { themes } = config

const ConnectButtonDynamic = dynamic(() => import('@connect2ic/react').then(mod => mod.ConnectButton), { ssr: false })

export default function AccountWallet(props) {
  // evm
  const evmWalletConnect = useEVMWalletConnect()
  const { switchChain } = useSwitchChain()
  const { openConnectModal } = useConnectModal()
  const { chainId } = useAccount()
  // solana
  const { setVisible } = useWalletModal()
  const { wallet: solanaWallet, connect } = useWallet()
  const { onDisconnect, buttonState, publicKey } = useWalletMultiButton({
    onSelectWallet() {
      setVisible(true)
    },
  })
  const solanaAccount = useMemo(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58()
      return getShortenMidDots(base58, 8)
    } else if (buttonState === 'connecting' || buttonState === 'has-wallet') {
      return labels[buttonState]
    } else {
      return labels['no-wallet']
    }
  }, [buttonState, labels, publicKey])

  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open)

  const handleWalletToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleWalletClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpen(false)
  }

  const handleChainsAction = async (item, type) => {
    switch (type) {
      case 'EVM':
      case 'Rollup':
        if (!item?.chain?.id) return
        evmWalletConnect ? switchChain({ chainId: item?.chain?.id }) : openConnectModal()
        break
      case 'Non-EVM':
        if (!item?.name) return
        switch (item.name.toLowerCase()) {
          case 'solana':
            if (solanaWallet?.readyState === 'Installed') {
              connect()
            } else {
              setVisible(true)
            }
            break
          case 'icp':
            break

          default:
            break
        }
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }
    prevOpen.current = open
  }, [open])

  return (
    <GlobalContextProvider>
      <article className={props?.customClass}>
        <header>
          {props?.exitGuide && (
            <p className="bg-zinc-200 w-24 h-2 mb-8 mx-auto rounded-3xl lg:hidden animate__animated animate__infinite animate__fadeInDown animate__slower" />
          )}
          <Typography variant="h5" className="font-semibold py-2">
            Connect your Multichain Wallet
          </Typography>
          <Typography variant="h6" className="font-semibold py-2">
            Send, pay, compound money. <span className="max-sm:block">All in one place.</span>
          </Typography>

          <p className="mt-1 text-neutral-400">
            Support multiple chains for EVM and Non-EVM, and the same social identity enjoys freedom on every chain.
          </p>
        </header>
        <section className="pt-12 grid grid-cols-1 gap-8">
          {supportChains.map((row, index) => (
            <Box className="p-6 border rounded-xl" key={`card-item-${index + 1}`}>
              <Grid container justifyContent="space-between" alignItems="center">
                <h1 className="card-title">{row.type}</h1>
                {['EVM'].includes(row?.type) && (
                  <NmWallet commonClass="px-8 shadow-sm rounded-lg" walletClass="bg-create-gradient-004" />
                )}
              </Grid>
              <p className="text-neutral-400 py-6">{row.desc}</p>
              <Box className="mb-8 flex flex-wrap gap-4">
                {row.type == 'Non-EVM' && <ICPModal />}
                {row.type == 'Non-EVM' && solanaWallet?.readyState === 'Installed' && publicKey && (
                  <Box className="p-3 w-full  border rounded-xl flex items-center justify-between">
                    <Avatar src={getActiveChain({ name: 'Solana' })?.icon} className="skeleton rounded-full" />
                    <ul className="flex-1 px-4 pr-6">
                      <li className="font-semibold">Solana</li>
                      <li className="text-neutral-400 text-sm">{solanaAccount}</li>
                    </ul>
                    <Button
                      ref={anchorRef}
                      aria-controls={open ? 'demo-customized-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      variant="contained"
                      size="small"
                      className="dropdown shadow-sm w-fit h-9 rounded-md text-white bg-create-gradient-004"
                      onClick={() => handleWalletToggle()}
                    >
                      Account
                    </Button>
                    <ChainsWalletCard
                      onClose={handleWalletClose}
                      anchorEl={anchorRef}
                      chainsExpand={open}
                      setChainsExpand={setOpen}
                      publicKey={publicKey}
                      onDisconnect={onDisconnect}
                    />
                  </Box>
                )}
              </Box>
              {row?.list && row?.list?.length > 0 && (
                <ul
                  className={classNames('flex flex-wrap gap-6', {
                    'grid grid-cols-1 sm:grid-cols-2': row?.type == 'Non-EVM',
                  })}
                >
                  {row?.list.map((item, kIndex) => {
                    if (solanaWallet?.readyState === 'Installed' && publicKey && item.name === 'Solana') return null
                    if (item.name === 'ICP')
                      return <ICPModal connected key={`card-item-chains-${index}-${kIndex + 1}`} />
                    return (
                      <li
                        className={classNames('relative cursor-pointer group flex items-center justify-between gap-2', {
                          tooltip: item?.disabled,
                          'p-3 border rounded-lg': row?.type == 'Non-EVM',
                        })}
                        data-tip="Upcoming"
                        key={`card-item-chains-${index}-${kIndex + 1}`}
                        onClick={e => handleChainsAction(item, row.type)}
                      >
                        <Avatar
                          src={item?.icon || getActiveChain({ name: item?.name })?.icon}
                          className={classNames(
                            'bg-transparent shadow-sm hover:rotate-y-360 duration-1000 transition-all',
                            {
                              'opacity-40': item?.disabled,
                            }
                          )}
                        />
                        {row?.type !== 'Non-EVM' && item?.chain?.id == chainId && (
                          <Avatar className="size-5 scale-90 bg-black absolute -bottom-1 right-0">
                            <NmIcon type="icon-tick" className="text-xs font-semibold" />
                          </Avatar>
                        )}
                        {row?.type == 'Non-EVM' &&
                          (!item?.disabled ? (
                            item.name == 'ICP' ? (
                              <ConnectButtonDynamic
                                style={{
                                  width: '8rem',
                                  height: '2.25rem',
                                  fontSize: '0.875rem',
                                  borderRadius: '0.5rem',
                                  justifyContent: 'center',
                                  backgroundImage: themes.backgroundImage['create-gradient-004'],
                                }}
                              >
                                Connect {item.name}
                              </ConnectButtonDynamic>
                            ) : (
                              <Button
                                size="large"
                                color="success"
                                variant="contained"
                                className="bg-create-gradient-004 w-32 truncate rounded-lg text-sm shadow-none"
                              >
                                Connect {item.name}
                              </Button>
                            )
                          ) : (
                            <strong className="opacity-15">{item.name}</strong>
                          ))}
                      </li>
                    )
                  })}
                </ul>
              )}
            </Box>
          ))}
        </section>
      </article>
    </GlobalContextProvider>
  )
}
