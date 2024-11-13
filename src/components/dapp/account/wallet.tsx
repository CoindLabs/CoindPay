import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Avatar, AvatarGroup, Box, Button, Grid2, Typography } from '@mui/material'
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
import { useEVMWalletConnect, useMobile } from '@/lib/hooks'
import { supportChains } from '@/lib/chains'
import { getShortenMidDots } from '@/lib/utils'
import { getActiveChain } from '@/lib/web3'

const ConnectButtonDynamic = dynamic(() => import('@connect2ic/react').then(mod => mod.ConnectButton), { ssr: false })

export default function AccountWallet(props) {
  const isMobile = useMobile()
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
      return getShortenMidDots(base58, isMobile ? 6 : 8)
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

  const handleChainsAction = async ({ data = null, type }) => {
    switch (type) {
      case 'EVM':
        if (!data?.chain?.id) return
        evmWalletConnect ? switchChain({ chainId: data?.chain?.id }) : openConnectModal()
        break
      case 'SVM':
        if (solanaWallet?.readyState === 'Installed') {
          connect()
        } else {
          setVisible(true)
        }
        break
      case 'Others':
        if (!data?.name) return

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
          <Typography variant="h6" className=" text-neutral-400 py-2">
            Send, pay, compound money. <span className="max-sm:block">All in one place.</span>
          </Typography>
        </header>
        <section className="pt-12 grid grid-cols-1 gap-8">
          {supportChains.map((row, index) => (
            <Box className="p-6 border rounded-xl" key={`card-item-${index + 1}`}>
              <Grid2 container justifyContent="space-between" alignItems="center">
                <h1 className="card-title">{row.type}</h1>

                {['SVM'].includes(row?.type) && solanaWallet?.readyState !== 'Installed' && !publicKey && (
                  <Button
                    size="large"
                    color="success"
                    variant="contained"
                    className="bg-create-gradient-004 px-8 shadow-sm rounded-lg"
                    onClick={() => handleChainsAction({ type: 'SVM' })}
                  >
                    Connect Wallet
                  </Button>
                )}

                {['EVM'].includes(row?.type) && (
                  <NmWallet commonClass="px-8 shadow-sm rounded-lg" walletClass="bg-black" />
                )}
              </Grid2>
              <p className="text-neutral-400 py-4">{row.desc}</p>

              <Box className="mb-8 flex flex-wrap gap-4">
                {row.type == 'SVM' && solanaWallet?.readyState === 'Installed' && publicKey && (
                  <Box className="p-3 max-sm:px-2 w-full border rounded-xl gap-2.5 flex items-center justify-between">
                    <AvatarGroup>
                      {row.list.map((ss, sIndex) => (
                        <Avatar
                          key={`svm-item-${sIndex}`}
                          src={ss.icon}
                          className={classNames('max-sm:size-9 skeleton rounded-full', ss.avatarClass)}
                        />
                      ))}
                    </AvatarGroup>
                    <ul className="flex-1">
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
                {row.type == 'Others' && <ICPModal />}
              </Box>

              {row?.list && row?.list?.length > 0 && (
                <ul
                  className={classNames('flex flex-wrap gap-6', {
                    'grid grid-cols-1 sm:grid-cols-2': ['SVM', 'Others'].includes(row?.type),
                  })}
                >
                  {row?.list.map((item, kIndex) => {
                    if (solanaWallet?.readyState === 'Installed' && publicKey && row?.type == 'SVM') return null

                    if (item.name == 'ICP')
                      return <ICPModal connected key={`card-item-chains-${index}-${kIndex + 1}`} />
                    return (
                      <li
                        className={classNames('relative cursor-pointer group flex items-center justify-between gap-2', {
                          tooltip: item?.disabled,
                          'sm:flex-1': row?.type == 'SVM',
                          'p-3 border rounded-lg': ['SVM', 'Others'].includes(row?.type),
                        })}
                        data-tip="Upcoming"
                        key={`card-item-chains-${index}-${kIndex + 1}`}
                        onClick={() =>
                          handleChainsAction({
                            data: item,
                            type: row.type,
                          })
                        }
                      >
                        <Avatar
                          src={item?.icon || getActiveChain({ name: item?.name })?.icon}
                          className={classNames(
                            'shadow-sm hover:rotate-y-360 duration-1000 transition-all',
                            {
                              'opacity-40': item?.disabled,
                            },
                            ['SOON'].some(cc => item?.name.includes(cc)) ? 'bg-black' : 'bg-transparent'
                          )}
                        />

                        {['EVM'].includes(row?.type) && item?.chain?.id == chainId && (
                          <Avatar className="size-5 scale-90 bg-black absolute -bottom-1 right-0">
                            <NmIcon type="icon-tick" className="text-xs font-semibold" />
                          </Avatar>
                        )}

                        {row?.type == 'SVM' && <strong>{item.name}</strong>}

                        {row?.type == 'Others' &&
                          (!item?.disabled ? (
                            item.name == 'ICP' && (
                              <ConnectButtonDynamic
                                style={{
                                  width: '8rem',
                                  height: '2.25rem',
                                  fontSize: '0.875rem',
                                  borderRadius: '0.5rem',
                                  justifyContent: 'center',
                                }}
                              >
                                Connect {item.name}
                              </ConnectButtonDynamic>
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
