import { useEffect, useRef, useState } from 'react'
import { useThrottleFn } from 'ahooks'
import classNames from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { Alert, Avatar, Backdrop, Box, Chip, Grid2, Typography } from '@mui/material'
import PaymentWidget from '@/components/dapp/landing/base/pay'
import NmSpinInfinity from '@/components/nm-spin/infinity'
import { getShortenMidDots } from '@/lib/utils'

import config from '@/config'

const { title, logo } = config

const Copyright = (classes = null) => (
  <footer className={classNames('flex justify-center items-center gap-1.5 text-neutral-300', classes)}>
    <span className="font-chillax">Powered by</span>
    <Link href="/" target="_blank">
      <Image alt="" width={100} height={50} src={logo.pro_mix_black} draggable={false} />
    </Link>
  </footer>
)

export default function PaymentLanding({ data, user, ...props }) {
  const nameRef = useRef(null)
  const [loading, setLoading] = useState(true)

  const [paymentForm, setPaymentForm] = useState(Object)
  const [paymentFormTips, setPaymentFormTips] = useState(Object || null)

  const { run: handlePaymentForm } = useThrottleFn(
    (key, value) => {
      setPaymentForm(prev => ({ ...prev, [key]: value }))

      if (paymentFormTips[key]) {
        delete paymentFormTips[key]
        setPaymentFormTips(paymentFormTips)
      }
    },
    { wait: 50 }
  )

  const handlePaymentSubmit = () => {
    if (paymentForm?.name) {
      if (paymentFormTips?.name) {
        delete paymentFormTips?.name
        setPaymentFormTips(paymentFormTips)
      }
    } else {
      setPaymentFormTips({
        ...paymentFormTips,
        name: true,
      })
      nameRef.current.focus()
    }
  }

  useEffect(() => {
    if (!data) {
      setLoading(true)
    } else {
      setTimeout(_ => {
        setLoading(false)
      }, 500)
    }
  }, [data])

  if (loading) {
    return <NmSpinInfinity absoluteXCenter absoluteYCenter customClass="loading-lg scale-150" />
  }

  return (
    <ul className={classNames('grid grid-cols-1 lg:grid-cols-2 min-h-screen', props?.customClass)}>
      <li className={classNames('bg-neutral-100 px-6 lg:px-12 py-10', props?.contentClass)}>
        <header className="flex flex-col lg:flex-row gap-2 items-center max-lg:pt-8">
          <Avatar className="size-18 lg:size-10" />

          <Link href={`/${data?.uuid}`} target="_blank" className="font-medium max-lg:text-center">
            <h1 className="text-2.5xl lg:text-lg">
              {user?.nickname || user?.username || getShortenMidDots(data?.uuid, 6)}
            </h1>
            {user?.bio && <p className="text-sm text-stone-300 font-light line-clamp-2">{user?.bio}</p>}
          </Link>
        </header>
        <section className="py-8 h-full flex flex-col justify-between">
          <ul className="flex flex-col gap-6">
            <li>
              {data?.images?.length ? (
                <ul className={classNames('w-full carousel bg-white rounded-box space-x-2 p-4')}>
                  {data?.images.map((row, index) => (
                    <li
                      className={classNames('carousel-item w-fit h-auto min-w-0 max-h-64', {
                        'flex-1': data?.images?.length == 1,
                      })}
                      key={`carousel-item-${index}`}
                    >
                      <Image
                        src={row.url}
                        alt=""
                        width={256}
                        height={256}
                        draggable={false}
                        className={classNames('rounded-lg object-contain', {
                          'w-full': data?.images?.length == 1,
                        })}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <Box className="skeleton w-full h-84" />
              )}
            </li>

            {data?.amountType != 2 && (
              <li>
                {data?.price > 0 && <span className="text-3.5xl pr-0.5 font-firasans font-bold">$</span>}
                {data?.price > 0 ? (
                  <span className="text-3xl font-semibold">{data?.price}</span>
                ) : (
                  <Chip label="Free" color="secondary" className="px-2" />
                )}
              </li>
            )}

            <li>
              <h1 className="text-3xl font-semibold font-chillax line-clamp-1">{data?.title}</h1>
              {data?.desc && (
                <p className="pt-3 line-clamp-20 opacity-50 whitespace-pre-wrap break-words">{data?.desc}</p>
              )}
            </li>
          </ul>
          {Copyright('max-lg:hidden')}
        </section>
      </li>
      <li className={classNames('flex flex-col gap-6 px-6 lg:px-12 py-10', props?.contentClass, props?.formClass)}>
        <Typography variant="h6" className="font-extrabold font-poppins">
          Pay with crypto
        </Typography>
        <ul className="py-2 flex flex-col gap-4">
          <li>
            <Box className="flex items-center pb-1">
              <h2>Name</h2>
              {paymentFormTips?.name && <span className="pl-1 text-theme-error">is required *</span>}
            </Box>
            <input
              ref={nameRef}
              type="text"
              maxLength={256}
              className={classNames(
                'w-full py-2.5 truncate rounded-md  focus:border-neutral-500 focus:bg-transparent focus:ring-0',
                paymentFormTips?.name ? 'border-theme-error bg-transparent' : 'bg-neutral-100 border-transparent'
              )}
              placeholder="Full name"
              value={paymentForm?.name}
              onChange={e => handlePaymentForm('name', e.target.value)}
            />
          </li>
          <li>
            <h2 className="pb-1">Email</h2>
            <input
              type="email"
              className={classNames(
                'w-full py-2.5 truncate rounded-md bg-neutral-100 border-transparent  focus:border-neutral-500 focus:bg-transparent focus:ring-0'
              )}
              placeholder="Email"
              value={paymentForm?.email}
              onChange={e => handlePaymentForm('email', e.target.value)}
            />
          </li>
        </ul>
        <PaymentWidget payee={data} widgetForm={{ ...paymentForm }} onSubmitPay={() => handlePaymentSubmit()} />
        {Copyright('lg:hidden pt-12')}
      </li>
      {data?.status == -1 && (
        <Alert component="li" severity="error" variant="filled" className="fixed w-full bottom-0 left-0 right-0 z-1">
          Invalid Payment Link that has gone offline!
        </Alert>
      )}
    </ul>
  )
}
