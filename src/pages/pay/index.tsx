import { useEffect, useState } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import StudioLayout from '@/components/layout/studio'
import PaymentCard from '@/components/dapp/landing/base/pay'
import LandingCard from '@/components/dapp/landing/base/card'
import { Button } from '@mui/material'
import NmIcon from '@/components/nm-icon'
import NmSpinInfinity from '@/components/nm-spin/infinity'
import { useSnackbar } from '@/components/context/snackbar'
import { useStudioContext } from '@/components/context/studio'
import { useGlobalWalletConnect, useLocation, useUserData } from '@/lib/hooks'
import { _supportChains } from '@/lib/types/chains'
import { getPayeeAccountSvc } from '@/services/pay'

export default function Pay() {
  const user = useUserData()
  const host = useLocation()
  const origin = useLocation('origin')

  const { showSnackbar } = useSnackbar()

  const { setAccountCardShow } = useStudioContext()

  const globalWalletConnect = useGlobalWalletConnect()
  const [payee, setPayee] = useState(Object)
  const [payeeTitle, setPayeeTitle] = useState('')
  const [payeeInitLoading, setPayeeInitLoading] = useState(true)
  const [themeIndex, setThemeIndex] = useState(0)

  const [submitLoading, setSubmitLoading] = useState(false)

  const handleCopyPayeeURL = () => {
    navigator.clipboard.writeText(`${origin}/${user?.id}`)
    showSnackbar({
      snackbar: {
        open: true,
        type: 'success',
        text: 'Payment profile copy success ᵔ◡ᵔ',
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
    let params = {
      id: user?.id,
      style: {
        theme: themeIndex,
      },
    }

    if (payeeTitle) params['title'] = payeeTitle

    let res = await getPayeeAccountSvc(params, 'post')
    if (res?.ok && res?.data) {
      setPayee(res?.data)
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
          setPayee(res?.data)
          setThemeIndex(res.data.style.theme)
          setPayeeTitle(res.data?.title || 'Pay me a Coffee')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
      setPayeeInitLoading(false)
    }
    getPayeeAccount()
  }, [user?.id])

  return (
    <StudioLayout>
      {payeeInitLoading ? (
        <NmSpinInfinity absoluteCenter customClass="top-[40%] loading-lg scale-150" />
      ) : (
        <ul className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          <LandingCard title="Widget" component="li" customClass="!my-0" tpls={{ style: `S00${themeIndex}` }}>
            <PaymentCard payeeId={payee?.id} />
          </LandingCard>
          <LandingCard
            title={
              <input
                placeholder="Custom your payment title"
                className={classNames(
                  'w-full text-xl leading-loose truncate border-0 border-b  bg-transparent outline-0 focus:ring-0 placeholder-shown:truncate placeholder:text-stone-300 border-neutral-400/15'
                )}
                defaultValue={payeeTitle}
                onChange={e => e.target.value?.length <= 256 && setPayeeTitle(e.target.value)}
              />
            }
            component="li"
            customClass="!my-0"
            innerClass="flex flex-col"
            tpls={{ style: `S00${themeIndex}` }}
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
                    onCardClick={() => setThemeIndex(index)}
                  >
                    {index == themeIndex && <NmIcon type="icon-tick" className="leading-0 text-xl" />}
                  </LandingCard>
                ))}
            </ul>

            {user?.id && payee?.id && (
              <LandingCard
                showCopy={false}
                component="li"
                customClass="rounded-lg !my-2 cursor-pointer"
                innerClass="flex items-center justify-between"
                tpls={{ style: `S00${themeIndex}` }}
              >
                <Link href={`${origin}/${user?.id}`} target="_blank" className="opacity-80 truncate">
                  {`${host}/${user?.id}`}
                </Link>
                <Button
                  size="small"
                  color="inherit"
                  className="px-2.5 text-nowrap shadow-none bg-create-gradient-004"
                  onClick={handleCopyPayeeURL}
                >
                  Copy Link
                </Button>
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
      )}
    </StudioLayout>
  )
}
