import { Ref, forwardRef, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Slide,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { useAccount } from 'wagmi'
import classNames from 'classnames'
import Header from '@/components/layout/header'
import NmIcon from '@/components/nm-icon'
import { useSnackbar } from '@/components/context/snackbar'
import { useStudioContext } from '@/components/context/studio'
import AccountWallet from '../account/wallet'
import { getUserAddressSvc } from '@/services/user'
import { setUserInfo } from '@/store/slice/user'
import { getActiveChain } from '@/lib/web3'
import { useAppDispatch, useGlobalWalletConnect, useSolAccount, useUserData } from '@/lib/hooks'

import config from '@/config'

const { logo } = config

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />
})

const StudioHeader = () => {
  let iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

  const theme = useTheme()
  const mdlScreen = useMediaQuery(theme.breakpoints.up('md'))
  const user = useUserData()
  const dispatch = useAppDispatch()
  const account = useAccount()
  const { solAddress } = useSolAccount()
  const globalWalletConnect = useGlobalWalletConnect()
  const { showSnackbar } = useSnackbar()
  const { accountCardShow, setAccountCardShow } = useStudioContext()

  const [dialog, setDialog] = useState({
    title: null,
    content: null,
    open: false,
  })

  const [loading, setSubmitLoading] = useState(false)

  const handleToggleDrawer =
    (open: boolean, type = 'drawer') =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      switch (type) {
        case 'dialog':
          setDialog({ ...dialog, open })
          break
        case 'drawer':
        default:
          setAccountCardShow(open)
          break
      }
    }

  const handleAccountSubmit = async (list = []) => {
    setSubmitLoading(true)
    let res = await getUserAddressSvc({
      addressList: list,
    })

    setSubmitLoading(false)
    if (res?.ok) {
      dispatch(
        setUserInfo({
          ...res?.data,
        })
      )
      showSnackbar({
        snackbar: {
          open: true,
          type: 'success',
          text: 'Account connect success ᵔ◡ᵔ',
        },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      })
      setAccountCardShow(false)
    } else {
      if (res?.boundAddressList?.length) {
        setDialog({
          ...dialog,
          open: true,
          title: res?.message,
          content: res?.boundAddressList,
        })
      } else if (res?.message) {
        showSnackbar({
          snackbar: {
            open: true,
            type: 'error',
            text: res?.message || 'Server error ˙◠˙',
          },
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        })
      }
    }
  }

  const handleReceiptSubmit = () => {
    if (!globalWalletConnect) return

    if (account?.address || solAddress) {
      try {
        let list = []
        if (account && account?.address) {
          list.push({ chain: 'evm', value: account?.address })
        }
        if (solAddress) {
          list.push({ chain: 'sol', value: solAddress })
        }

        handleAccountSubmit(list)
      } catch (error) {
        console.error('Error fetching user account:', error)
      }
    }
  }

  const bindChainIcon = chain => {
    switch (chain) {
      case 'evm':
        return getActiveChain({ name: 'Ethereum' })?.icon
        break
      case 'sol':
        return getActiveChain({ name: 'Solana' })?.icon
        break
      default:
        return logo.pro_colors
        break
    }
  }

  useEffect(() => {
    if (accountCardShow && !globalWalletConnect) {
      dispatch(setUserInfo(null))
    }
  }, [globalWalletConnect])

  return (
    <nav className="sticky z-10 top-0 backdrop-blur flex items-center justify-between sm:rounded-b-md px-4 md:px-8 lg:max-xl:px-4 xl:px-12">
      <Header
        action={false}
        logoImg={logo.pro_colors}
        logoImgClass="max-lg:size-12"
        logoTextClass="text-black max-lg:hidden"
        customClass="my-2 sm:my-4"
      />
      <ul>
        <li>
          <Button
            size="large"
            variant="contained"
            className="min-w-40 py-2.5 shadow-none rounded-lg bg-create-gradient-004"
            onClick={handleToggleDrawer(true)}
          >
            {(user?.id ? globalWalletConnect : globalWalletConnect && user?.id) ? (
              <Box className="flex items-center">
                Account Wallet
                <NmIcon type="icon-user" className="ml-4 text-lg leading-0" />
              </Box>
            ) : (
              'Connect Wallet'
            )}
          </Button>
        </li>
      </ul>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        anchor={mdlScreen ? 'right' : 'bottom'}
        open={accountCardShow}
        onClose={handleToggleDrawer(false)}
        onOpen={handleToggleDrawer(true)}
      >
        <AccountWallet exitGuide customClass="p-8 lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl" />
        <footer className="sticky bottom-0 flex justify-center items-center gap-6 pb-2 pt-3 text-center w-full px-4 backdrop-blur">
          <IconButton className="size-11 bg-create-gradient-004 text-white" onClick={handleToggleDrawer(false)}>
            <NmIcon type="icon-close" />
          </IconButton>
          <Button
            size="large"
            variant="contained"
            className={classNames(
              'w-full max-w-md py-3 rounded-lg md:rounded-full text-lg shadow-sm transition-all bg-create-gradient-004',
              {
                'opacity-70': !globalWalletConnect,
                'animate__animated animate__infinite animate__headShake animate__slower': !user?.id,
              }
            )}
            onClick={handleReceiptSubmit}
            disabled={!globalWalletConnect}
          >
            {loading && <NmIcon type="icon-spin" className="animate-spin mr-2" />}
            {loading ? 'Submit' : user?.id ? 'Confirm' : 'Please confirm first'}
          </Button>
        </footer>
      </SwipeableDrawer>
      <Dialog
        TransitionComponent={Transition}
        open={dialog.open}
        onClose={handleToggleDrawer(false, 'dialog')}
        PaperComponent={props => {
          return (
            <Paper
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                margin: '1.5rem',
                borderRadius: '0.8rem',
              }}
              {...props}
            />
          )
        }}
      >
        <DialogTitle id="dialog-account-title" className="font-semibold text-1.5xl">
          Account Binding Illegal
          {dialog.title && <p className="pt-2 font-medium text-base text-neutral-400">{dialog.title} ˙◠˙</p>}
          <IconButton
            size="small"
            className="bg-neutral-950 text-white absolute right-2 top-2"
            onClick={handleToggleDrawer(false, 'dialog')}
          >
            <NmIcon type="icon-close" className="scale-95" />
          </IconButton>
        </DialogTitle>

        {dialog?.content && dialog?.content?.length && (
          <DialogContent>
            <ul className="flex flex-col gap-4">
              {dialog?.content.map((row, index) => (
                <li key={`dialog-account-item-${index}`}>
                  <Card className="p-4 border rounded-md shadow-sm">
                    <ul className="chat chat-start">
                      <li className="chat-image avatar">
                        <Avatar src={logo.dark} />
                      </li>
                      <li className="chat-header ml-2">uuid</li>
                      <li className="chat-bubble">
                        <Link href={`/${row?.uuid}`} target="_blank">
                          {row?.uuid}
                        </Link>
                      </li>
                    </ul>
                    <Grid>
                      {row?.addresses?.length &&
                        row?.addresses.map((item, aIndex) => (
                          <ul className="chat chat-end" key={`dialog-account-item-wallet-${aIndex}`}>
                            <li className="chat-image avatar">
                              <Avatar src={bindChainIcon(item.chain)} />
                            </li>
                            <li className="chat-header mr-2">address</li>
                            <li className="chat-bubble chat-bubble-accent break-all">{item?.value}</li>
                          </ul>
                        ))}
                    </Grid>
                  </Card>
                </li>
              ))}
            </ul>
          </DialogContent>
        )}
      </Dialog>
    </nav>
  )
}

export default StudioHeader
