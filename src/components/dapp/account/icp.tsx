import React, { useRef, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import classNames from 'classnames'
import { Button, Paper, Popper, ClickAwayListener, MenuList, MenuItem, Grow, Box, Avatar } from '@mui/material'
import { useICPConnect } from '@/components/context/chains/icp/connect'
import { labels } from '@/components/nm-chains-wallet'
import { setIcpInfo, clearIcpInfo } from '@/store/slice/icp'
import { writeLastConnectType, writeLastUsedType } from '@/lib/utils/storage'
import { useAppDispatch } from '@/lib/hooks'
import { getShortenMidDots } from '@/lib/utils'
import { logoChains } from '@/lib/chains'
import { principal2account } from '@/lib/utils/ic/account'

import config from '@/config'

const { themes } = config

const ConnectButtonDynamic = dynamic(() => import('@connect2ic/react').then(mod => mod.ConnectButton), { ssr: false })

const itemsClass = 'py-1 leading-12 text-white justify-center hover:bg-zinc-900 transition-all'

const ICPModal = ({ connected }: { connected?: boolean }) => {
  // ICP
  const { icpState } = useICPConnect()
  const dispatch = useAppDispatch()
  if (!icpState?.useWallet && !icpState?.useBalance && !icpState?.useConnect && !icpState?.useDialog) {
    return null
  }

  const [wallet] = icpState.useWallet()
  const [balance] = icpState.useBalance()
  const { open: ICPOpen, close, isOpen } = icpState.useDialog()
  const {
    principal,
    connect,
    disconnect,
    status,
    isInitializing,
    isIdle,
    isConnecting,
    isConnected,
    isDisconnecting,
    activeProvider,
  } = icpState.useConnect({
    onConnect: connected => {
      // Signed in
      const provider = connected.activeProvider
      let connectType = provider.meta.id
      dispatch(
        setIcpInfo({ ...connected, accountId: provider?.principal ? principal2account(provider.principal) : '' })
      )
      writeLastConnectType(connectType)
      writeLastUsedType(connectType)
    },
    onDisconnect: () => {
      // Signed out
      dispatch(clearIcpInfo())
      writeLastConnectType('')
      writeLastUsedType('')
    },
  })
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const accountId = useMemo(() => {
    return principal ? principal2account(principal) : ''
  }, [principal])

  const handleWalletToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleWalletClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpen(false)
  }

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <>
      {!connected && accountId ? (
        <Box className="p-3 w-full  border rounded-xl flex items-center justify-between">
          <Avatar src={logoChains.icp} className="skeleton bg-transparent rounded-full" />
          <ul className="flex-1 px-4 pr-6">
            <li className="font-semibold">ICP</li>
            <li className="text-neutral-400 text-sm whitespace-nowrap">{getShortenMidDots(accountId, 8)}</li>
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
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom"
            transition
            disablePortal
            className="z-100"
            keepMounted
          >
            {({ TransitionProps, placement }) => {
              return (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === 'bottom' ? 'top' : 'bottom',
                  }}
                >
                  <Paper className="z-100 rounded-md bg-black/80 backdrop-blur">
                    <ClickAwayListener onClickAway={handleWalletClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                        className="z-10 py-0 mt-0.5 w-50 overflow-hidden rounded-[inherit]"
                      >
                        {accountId ? (
                          <MenuItem
                            className={classNames(itemsClass)}
                            onClick={async () => {
                              await navigator.clipboard.writeText(accountId)
                              setCopied(true)
                              setTimeout(() => setCopied(false), 400)
                            }}
                          >
                            {copied ? labels?.copied : labels?.copy_address}
                          </MenuItem>
                        ) : null}
                        {disconnect ? (
                          <MenuItem
                            className={classNames('border border-t border-zinc-500', itemsClass)}
                            onClick={() => {
                              setOpen(false)
                              setTimeout(() => disconnect(), 300)
                            }}
                          >
                            {labels?.disconnect}
                          </MenuItem>
                        ) : null}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )
            }}
          </Popper>
        </Box>
      ) : connected && !accountId ? (
        <li
          className={classNames(
            'relative cursor-pointer group flex items-center justify-between gap-2 p-3 border rounded-lg'
          )}
        >
          <Avatar
            src={logoChains.icp}
            className={classNames('bg-transparent shadow-sm hover:rotate-y-360 duration-1000 transition-all')}
          />
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
            Connect ICP
          </ConnectButtonDynamic>
        </li>
      ) : (
        <></>
      )}
    </>
  )
}

export default ICPModal
