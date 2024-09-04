import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import StudioLayout from '@/components/layout/studio'
import PaymentCard from '@/components/dapp/landing/base/pay'
import LandingCard from '@/components/dapp/landing/base/card'
import { Alert, Box, Button, SwipeableDrawer, Switch, useMediaQuery, useTheme } from '@mui/material'
import NmIcon from '@/components/nm-icon'
import NmSpinInfinity from '@/components/nm-spin/infinity'
import { useSnackbar } from '@/components/context/snackbar'
import { useStudioContext } from '@/components/context/studio'
import { getPayeeAccountSvc } from '@/services/pay'
import { setPayeeInfo } from '@/store/slice/payee'
import {
  useAppDispatch,
  useGlobalWalletConnect,
  useInitPayChainIndex,
  useLocation,
  useMobile,
  usePayeeData,
  useUserData,
} from '@/lib/hooks'
import { _supportChains } from '@/lib/chains'

const switchLabel = { inputProps: { 'aria-label': 'Switch' } }

export default function Pay() {
  let iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

  const router = useRouter()

  const chainIndex = useInitPayChainIndex()

  const theme = useTheme()
  const mdlScreen = useMediaQuery(theme.breakpoints.up('md'))

  const user = useUserData()

  const origin = useLocation('origin')

  const dispatch = useAppDispatch()
  const payee = usePayeeData()

  const { showSnackbar } = useSnackbar()
  const { setAccountCardShow } = useStudioContext()

  const globalWalletConnect = useGlobalWalletConnect()

  const [payeeInitLoading, setPayeeInitLoading] = useState(true)

  const [submitLoading, setSubmitLoading] = useState(false)

  const [drawer, setDrawer] = useState({
    open: false,
    iframeLoad: true,
  })

  const [widgetStyle, setWidgetStyle] = useState(Object)
  const widgetCode = `<iframe src='${origin}/${user?.id}?mode=widget${router.query?.chain ? `&chain=${router.query?.chain}` : ''}' 
height="100%"
className="md:w-120 max-sm:min-h-[81vh]"
/>`

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
        case 'drawer':
        default:
          setDrawer({ ...drawer, open })
          break
      }
    }

  const handleCopyPayeeWidget = () => {
    navigator.clipboard.writeText(widgetCode)
    showSnackbar({
      snackbar: {
        open: true,
        type: 'success',
        text: 'Payments widget code copy success ᵔ◡ᵔ',
      },
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
    })
  }

  const handlePaymentAction = async () => {
    if (!globalWalletConnect || !user?.id) return setAccountCardShow(true)
    setSubmitLoading(true)

    let res = await getPayeeAccountSvc({ ...payee, uuid: user?.id }, 'post')
    if (res?.ok && res?.data) {
      dispatch(setPayeeInfo(res?.data))
    }
    showSnackbar({
      snackbar: {
        open: true,
        type: res?.ok ? 'success' : 'error',
        text: res?.ok ? 'Payment publish success ᵔ◡ᵔ' : res?.message || 'Server error ˙◠˙',
      },
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
    })
    setSubmitLoading(false)
  }

  useEffect(() => {
    if (!user?.id) return setPayeeInitLoading(false)
    const getPayeeAccount = async () => {
      try {
        let res = await getPayeeAccountSvc({
          id: user?.id,
        })
        if (res?.ok && res?.data) {
          dispatch(setPayeeInfo(res?.data))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
      setPayeeInitLoading(false)
    }
    getPayeeAccount()
  }, [user?.id])

  useEffect(() => {
    import('react-syntax-highlighter/dist/esm/styles/prism/one-dark').then(mod => setWidgetStyle(mod.default))
  })

  return (
    <StudioLayout>
      {payeeInitLoading ? (
        <NmSpinInfinity absoluteCenter customClass="top-[40%] loading-lg scale-150" />
      ) : (
        <>
          <ul className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            <LandingCard
              title={payee?.title || 'Widget'}
              titleClass={classNames({
                'mx-auto': payee?.title,
              })}
              component="li"
              customClass="!my-0"
              tpls={{ style: `S00${payee?.style?.theme}` }}
            >
              <PaymentCard payee={payee} />
            </LandingCard>
            <LandingCard
              title={
                <Box className="w-full relative flex items-center">
                  <NmIcon type="icon-edit" className="absolute left-0" />
                  <input
                    placeholder="Custom your payment title"
                    className={classNames(
                      'flex-1 text-right text-xl pl-7 leading-loose truncate border-0 border-b bg-transparent outline-0 focus:ring-0 placeholder-shown:truncate placeholder:text-stone-300/60 border-neutral-400/15'
                    )}
                    defaultValue={payee?.title}
                    onChange={e => e.target.value?.length <= 256 && dispatch(setPayeeInfo({ title: e.target.value }))}
                  />
                </Box>
              }
              component="li"
              customClass="!my-0"
              innerClass="flex flex-col"
              tpls={{ style: `S00${payee?.style?.theme}` }}
            >
              <ul className="flex items-center justify-around gap-4 mt-6">
                {Array(6)
                  .fill(0)
                  .map((row, index) => (
                    <LandingCard
                      component="li"
                      key={`style-item-${index}`}
                      customClass="pt-2 !mt-0 size-12 rounded-full cursor-pointer"
                      tpls={{ style: `S00${index}` }}
                      onCardClick={() => dispatch(setPayeeInfo({ style: { theme: index } }))}
                    >
                      {index == payee?.style?.theme && <NmIcon type="icon-tick" className="leading-0 text-xl" />}
                    </LandingCard>
                  ))}
              </ul>

              <ul className="px-3.5 py-2.5 mb-4 rounded-lg border border-dashed border-stone-300/30 flex items-center justify-between">
                <li>Account Info</li>
                <li>
                  <Switch
                    {...switchLabel}
                    color="success"
                    disableRipple
                    checked={payee?.accountInfo}
                    onChange={e => dispatch(setPayeeInfo({ accountInfo: e.target.checked }))}
                  />
                </li>
              </ul>

              <ul className="px-3.5 py-2.5 mb-4 rounded-lg border border-dashed border-stone-300/30 flex items-center justify-between">
                <li>Copyright（Powered By）</li>
                <li>
                  <Switch
                    {...switchLabel}
                    color="success"
                    disableRipple
                    checked={payee?.copyright}
                    onChange={e => dispatch(setPayeeInfo({ copyright: e.target.checked }))}
                  />
                </li>
              </ul>

              {user?.id && payee?.id && (
                <LandingCard
                  showCopy={false}
                  customClass="rounded-lg !my-2 cursor-pointer"
                  tpls={{ style: `S00${payee?.style?.theme}` }}
                >
                  <Button
                    size="small"
                    color="inherit"
                    className="absolute right-2 top-2 py-0.5 scale-95 text-nowrap shadow-none bg-create-gradient-004"
                    onClick={handleCopyPayeeWidget}
                  >
                    Copy
                  </Button>
                  <SyntaxHighlighter
                    wrapLongLines
                    language="typescript"
                    style={widgetStyle}
                    className="break-words"
                    onClick={() => setDrawer({ ...drawer, open: true })}
                  >
                    {widgetCode}
                  </SyntaxHighlighter>
                </LandingCard>
              )}

              <footer className="flex-1 content-end text-center pt-8 lg:pt-0">
                <Button
                  size="large"
                  variant="contained"
                  className="w-full max-w-md rounded-lg text-lg py-[0.7rem] shadow-sm transition-all bg-create-gradient-004"
                  onClick={handlePaymentAction}
                  disabled={submitLoading}
                >
                  {submitLoading && <NmIcon type="icon-spin" className="animate-spin mr-2" />}
                  Publish
                </Button>
              </footer>
            </LandingCard>
          </ul>
          <SwipeableDrawer
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
            anchor={mdlScreen ? 'left' : 'bottom'}
            open={drawer.open}
            onClose={handleToggleDrawer(false)}
            onOpen={handleToggleDrawer(true)}
            className="relative"
          >
            <Alert severity="success" className="mb-4">
              Preview your payments widget
            </Alert>
            {drawer.iframeLoad && <NmSpinInfinity absoluteXCenter customClass="mx-auto top-1/2 loading-lg scale-120" />}
            <iframe
              height="100%"
              className="md:w-120 max-sm:min-h-[81vh]"
              src={`${origin}/${user?.id}?mode=widget`}
              onLoad={() => setDrawer({ ...drawer, iframeLoad: false })}
            />
          </SwipeableDrawer>
        </>
      )}
    </StudioLayout>
  )
}
