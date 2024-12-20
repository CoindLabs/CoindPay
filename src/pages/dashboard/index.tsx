import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import {
  Avatar,
  Box,
  Button,
  Drawer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { ChainId, ChainKey, ChainType, getTokens } from '@lifi/sdk'
import { CountUp } from 'use-count-up'
import StudioLayout from '@/components/layout/studio'
import NmIcon from '@/components/nm-icon'
import NmTooltip from '@/components/nm-tooltip'
import NmSpinInfinity from '@/components/nm-spin/infinity'
import { FlipWords } from '@/components/aceternity-ui/flip-words'
import ItemCoinsSwiper from '@/components/dapp/home/swiper-card/item-coins'
import { get1InchTokenSvc, getSushiTokenSvc, getJupTokenPriceSvc, getSolTokenListSvc } from '@/services/common'
import { getPaymentOrderSvc } from '@/services/pay'
import { useMobile, useUserData } from '@/lib/hooks'
import { getCompareIgnoreCase, getNFTOrScanUrl, getShortenMidDots } from '@/lib/utils'
import { _supportChains, payChains } from '@/lib/chains'
import { getActiveChain } from '@/lib/web3'
import * as pay from '@/lib/chains/tokens'

import config from '@/config'

const animateWords = ['Business', 'Invoice', 'Checkout', 'Recurring', 'Connect']

const { domains } = config

const {
  solana,
  soon,
  ethereum,
  base,
  optimism,
  arbitrum,
  bsc,
  polygon,
  zkSync,
  aurora,
  fuse,
  zeta,
  metis,
  sei,
  scroll,
  celo,
  boba,
  taiko,
  hashkey,
} = pay

export default function Dashboard() {
  const isMobile = useMobile()
  const user = useUserData()
  const router = useRouter()
  const tokensCache = useRef([
    ...solana.list,
    ...soon.list,
    ...ethereum.list,
    ...base.list,
    ...optimism.list,
    ...arbitrum.list,
    ...bsc.list,
    ...polygon.list,
    ...zkSync.list,
    ...metis.list,
    ...sei.list,
    ...aurora.list,
    ...fuse.list,
    ...zeta.list,
    ...scroll.list,
    ...celo.list,
    ...boba.list,
    ...taiko.list,
    ...hashkey.list,
  ])
  const tokensPrice = useRef([])
  const [loading, setPaymentsLoading] = useState(false)
  const [loadMore, setPaymentsLoadMore] = useState(false)
  const paymentsListCache = useRef([])
  const [payments, setPaymentsData] = useState({
    list: [],
    total: 0,
  })
  const [drawer, setDrawer] = useState({
    videoLoaded: false,
    open: false,
  })
  const requestCount = useRef(0)
  const [chainIndex, setChainIndex] = useState(-1) // 默认次序-1，All chains

  useEffect(() => {
    getMultichainTokenList()

    // 初次加载后，20s见隔req
    fetchPaymentOrder(true)

    const intervalId = setInterval(() => {
      fetchPaymentOrder(false)
    }, 20000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [user?.id])

  const fetchPaymentOrder = async (spin = false) => {
    setPaymentsLoadMore(true)
    if (requestCount.current <= 50) {
      await getPaymentOrder(spin)
      requestCount.current += 1
    }
  }

  const getPaymentOrder = async (spin = false) => {
    setPaymentsLoading(spin)
    let res = await getPaymentOrderSvc({ uuid: user?.id })
    if (res?.ok && res?.data?.length) {
      let chainIdProd = name => payChains.find(row => row.name.includes(name))?.['chainIdProd'],
        paymentsData = res?.data.filter(item => !item?.chain.includes('Zeta')),
        lifiChainIds = [
          ...new Set(
            paymentsData.map(item => chainIdProd(item?.chain) as ChainId | ChainKey) // 类型断言
          ),
        ] as (ChainId | ChainKey)[]

      const chainTokens = await getTokens({
        chains: lifiChainIds,
        chainTypes: [ChainType.EVM, ChainType.SVM],
      })

      if (chainTokens?.tokens) {
        for (let item of paymentsData) {
          let chainTokenItem = payChains
            .find(row => row.name.includes(item?.chain))
            ?.['list']?.find(zz => zz.address == item.contract)
          tokensPrice.current = Object.assign(tokensPrice.current, {
            [`${item.symbol}_${item.contract}`]:
              chainTokenItem?.price ||
              chainTokens.tokens[chainIdProd(item?.chain)]?.find(
                row => row.address == item.contract || row.address == chainTokenItem?.price_address
              )?.priceUSD,
          })
        }
      }

      paymentsListCache.current = paymentsData

      setPaymentsData({
        list: paymentsData,
        total: paymentsData?.reduce(
          (total, item) => total + item.amount * handleTokenPriceFactory(`${item?.symbol}_${item?.contract}`),
          0
        ),
      })
    }
    setPaymentsLoading(false)
    setPaymentsLoadMore(false)
  }

  const getMultichainTokenList = async () => {
    let [solRes] = await Promise.allSettled([getSolTokenListSvc()])

    if (solRes?.status == 'fulfilled' && solRes?.value?.length)
      tokensCache.current = tokensCache.current?.concat(solRes?.value)
  }

  const handleSwitchChain = async index => {
    if (payChains[index]?.disabled) return
    setChainIndex(index)
    setPaymentsData({
      ...payments,
      list:
        index == -1
          ? paymentsListCache.current
          : paymentsListCache.current.filter(
              row =>
                payChains[index]?.name?.includes(row.chain) ||
                (row?.chainId && row?.chainId == payChains[index]?.['chainId'])
            ),
    })
  }

  const handleTokenPriceFactory = key =>
    tokensPrice.current?.[key]?.priceUSD ||
    tokensPrice.current?.[key?.toLowerCase()]?.priceUSD ||
    tokensPrice.current?.[key] ||
    tokensPrice.current?.[key?.toLowerCase()] ||
    0

  return (
    <StudioLayout>
      <header className="2xl:text-lg">
        <h1 className="leading-normal text-4xl lg:text-5xl 2xl:text-6xl font-poppins font-bold animate__animated animate__fadeInDown">
          <strong>All Your</strong>
          <FlipWords words={animateWords} className="pl-2" />
          <p className="sm:inline text-xl lg:text-2xl 2xl:text-3xl font-semibold">Payments in One Place</p>
        </h1>
        <p className="text-neutral-400 pt-2">
          A smart wallet portfolio that automatically invests (stakes, lps, etc.) and earns money.
        </p>
      </header>
      <ItemCoinsSwiper customClass="my-12" avatarClass="bg-black" />
      <ul className="p-6 max-sm:pl-4 my-8 rounded-lg border border-stone-100 hover:border-stone-200/80 flex flex-col relative overflow-hidden transition-all">
        <li className="flex justify-between items-center">
          <Box className="bg-clip-text text-transparent bg-create-gradient-004">
            <h3 className="text-lg pb-6">Accumulated →</h3>
            <Box className="text-4.5xl xl:text-5.5xl font-medium">
              <strong className="font-semibold font-courgette">
                <CountUp
                  isCounting
                  start={0}
                  end={Number(payments?.total?.toFixed(3) || 0)}
                  duration={5}
                  thousandsSeparator=","
                />
              </strong>
              <span className={classNames('opacity-100 text-xl font-bold font-satisfy ml-4')}>USD</span>
            </Box>
          </Box>
          <Box className="-mb-4 -mr-4">
            <video
              src={`${domains.cdn}/status/video_wallet_payments_process.mp4`}
              // @ts-ignore
              type="video/mp4"
              loading="lazy"
              width="100%"
              className="w-48 sm:w-60"
              loop
              muted
              playsInline
              autoplay="autoplay"
            />
          </Box>
          <Box className="absolute top-2 right-2" onClick={() => fetchPaymentOrder(false)}>
            <NmIcon
              type="icon-refresh"
              className={classNames(
                'text-xl text-success opacity-60 cursor-pointer hover:scale-105 hover:opacity-100 transition-all',
                {
                  'animate-spin leading-0': loading || loadMore,
                }
              )}
            />
          </Box>
        </li>
        <li className="flex-1">
          <ul className="flex flex-wrap gap-4  mt-12 my-4">
            {['lido', 'maker', 'aave', 'compound'].map((row, index) => (
              <li
                className="p-3 flex-1 min-w-36 flex items-center justify-between rounded-md border border-gray-100"
                key={`${row}-${index}`}
              >
                <Image
                  className="rounded-full max-sm:size-10"
                  src={`${domains.cdn}/static/social/${row}.png`}
                  width={48}
                  height={48}
                  alt=""
                  draggable={false}
                />
                <strong className="capitalize">{row}</strong>
              </li>
            ))}
          </ul>
          <NmTooltip title="Upcoming">
            <Button
              size="large"
              color="success"
              variant="contained"
              className="round-md shadow-none py-3 bg-create-gradient-004"
              fullWidth
            >
              Stake and Automatic compound
            </Button>
          </NmTooltip>
        </li>
      </ul>
      <section className="mt-12 mb-2">
        <h1 className="text-xl sm:text-2xl font-bold">Transactions</h1>
        <p className="text-neutral-400 py-2">
          Not limited to collections, bounties, sales shares, content shares, etc.
        </p>
      </section>
      {/* <ul className="carousel gap-6 py-8 w-full items-center">
        <li className="carousel-item">
          <Button
            size="large"
            className={classNames('rounded-full shadow-sm', {
              'bg-create-gradient-004': chainIndex == -1,
            })}
            variant={chainIndex == -1 ? 'contained' : 'outlined'}
            onClick={() => handleSwitchChain(-1)}
          >
            All Chains
          </Button>
        </li>
        {payChains.map((item, index) => {
          let avatarBox = ({ classes = null } = {}) => (
            <Avatar
              src={item?.icon || getActiveChain({ name: item?.name })?.icon}
              className={classNames(
                item?.disabled ? 'cursor-not-allowed opacity-10' : 'cursor-pointer',
                {
                  'bg-black p-1.5': item?.name
                    .split(' ')
                    .some(word => ['SOON', 'Arbitrum', 'BSC', 'Polygon', 'Aurora'].includes(word)),
                },
                classes
              )}
            />
          )
          return (
            <li
              key={`chain-item-${item?.name}-${index}`}
              className={classNames('carousel-item', {
                tooltip: index !== chainIndex,
              })}
              data-tip={item?.disabled ? 'Upcoming' : item?.name}
              onClick={() => handleSwitchChain(index)}
            >
              {index == chainIndex && !item?.disabled ? (
                <Box className="pr-2.5 py-px flex items-center rounded-full transition-all bg-create-gradient-004">
                  {avatarBox({ classes: 'hover:scale-105 transition-all' })}
                  <strong className="pl-1 text-white">{item?.name}</strong>
                </Box>
              ) : (
                avatarBox()
              )}
            </li>
          )
        })}
      </ul> */}
      {loading ? (
        <Box className="mt-16 mx-auto text-center">
          <NmSpinInfinity customClass="loading-lg scale-150" />
        </Box>
      ) : payments.list?.length > 0 ? (
        <TableContainer component={Paper} className="shadow-none overflow-y-hidden bg-transparent min-h-60">
          <Table className="w-full">
            <TableHead>
              <TableRow>
                {[
                  {
                    name: 'Customer',
                    align: 'left',
                  },
                  {
                    name: 'Transaction',
                    align: 'left',
                  },
                  {
                    name: 'Chain',
                    align: 'left',
                  },
                  {
                    name: 'Date',
                    align: 'center',
                  },
                  {
                    name: 'Amount',
                    align: 'right',
                  },
                ].map((item, index) => (
                  <TableCell
                    key={`table-item-head-${index}`}
                    // @ts-ignore
                    align={item?.align || 'inherit'}
                    className="font-semibold text-neutral-700"
                  >
                    {item.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.list?.map((item, index) => {
                let tokenItem = tokensCache.current.find(
                    row =>
                      (row?.address == item?.contract || row?.['price_address'] == item?.contract) &&
                      getCompareIgnoreCase(row.symbol, item?.symbol)
                  ),
                  chainIcon = ({ classes = null } = {}) => (
                    <Image
                      alt=""
                      width={36}
                      height={36}
                      src={
                        _supportChains().find(row => item?.chain?.includes(row?.name))?.icon ||
                        getActiveChain({ name: item?.chain })?.icon
                      }
                      className={classNames(
                        'rounded-full',
                        {
                          'bg-black': item?.chain.includes('SOON'),
                        },
                        classes
                      )}
                    />
                  ),
                  payeeLink = (
                    <Link
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      href={getNFTOrScanUrl({
                        type: 'address',
                        chain: item.chain?.replace(/\s/g, '-'),
                        chainId: item?.chainId,
                        address: item?.payer,
                      })}
                      className="block text-neutral-900 hover:text-theme-accent font-semibold text-md"
                    >
                      {getShortenMidDots(item.payer, isMobile ? 4 : 8)}
                    </Link>
                  )

                return (
                  <TableRow key={`table-item-body-${index}`} className="group">
                    <TableCell>
                      <ul className="flex items-center gap-2">
                        <li className="max-lg:hidden">
                          <Avatar className="size-9 bg-zinc-300" />
                        </li>
                        {item?.name ? (
                          <li>
                            <strong>{item?.name}</strong>
                            <p className="text-neutral-800/40 text-sm">{item?.email}</p>
                          </li>
                        ) : (
                          <li>{payeeLink}</li>
                        )}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul className="flex items-center gap-2">
                        <li className="pt-1 relative">
                          <Avatar src={tokenItem?.logoURI} className="max-sm:size-8" />
                          {chainIcon({
                            classes: classNames('size-4 sm:size-5 border absolute top-0 right-0', {
                              'bg-white': ['Arbitrum', 'BSC', 'Polygon', 'Aurora'].includes(item?.chain),
                            }),
                          })}
                        </li>
                        <li className="max-sm:max-w-40 xl:max-w-2xl">
                          {item?.name && payeeLink}
                          <Link
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            href={getNFTOrScanUrl({
                              type: 'tx',
                              chain: item.chain?.replace(/\s/g, '-'),
                              chainId: item?.chainId,
                              hash: item?.signature,
                            })}
                            className="text-neutral-800/50 hover:text-theme-accent/50 text-sm"
                          >
                            {getShortenMidDots(item.signature, isMobile ? 4 : 16)}
                          </Link>
                          {item?.message && (
                            <Box className="text-neutral-800/40 text-sm sm:flex items-center">
                              <NmTooltip title={item?.message}>
                                <span className="badge badge-accent mr-1">Message</span>
                              </NmTooltip>
                              <p className="truncate">{item?.message}</p>
                            </Box>
                          )}
                        </li>
                      </ul>
                    </TableCell>
                    <TableCell>
                      <NmTooltip title={item.chain}>{chainIcon({ classes: 'size-8' })}</NmTooltip>
                    </TableCell>
                    <TableCell align="center">{dayjs(item?.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                    <TableCell align="right">
                      <ul>
                        <li className="text-sm">${handleTokenPriceFactory(`${item?.symbol}_${item?.contract}`)}</li>
                        <li className="bg-clip-text text-transparent bg-create-gradient-004">
                          + {item.amount} {tokenItem?.symbol || item?.symbol}
                        </li>
                        <li className="text-neutral-800/50 text-sm">
                          ≈
                          <span className="px-0.5">
                            {Number(
                              (item.amount * handleTokenPriceFactory(`${item?.symbol}_${item?.contract}`)).toFixed(3)
                            )}
                          </span>
                          USD
                        </li>
                      </ul>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <ul className="pt-4">
          <li className="flex gap-8 justify-center items-center">
            <h2 className="text-2xl md:text-3xl bg-clip-text text-transparent bg-create-gradient-004 font-righteous">
              Now start your first Crypto Payments.
            </h2>
            <Avatar
              className="shadow-sm cursor-pointer bg-create-gradient-004 hover:scale-105 transition-all"
              onClick={() => router.push('pay')}
            >
              <NmIcon type="icon-arrow_down" className="text-2xl -rotate-90" />
            </Avatar>
          </li>
          <li className="flex justify-center pt-8">
            <video
              src={`${domains.cdn}/status/video_wallet_payments_empty.mp4`}
              // @ts-ignore
              type="video/mp4"
              loading="lazy"
              className="w-120"
              loop
              muted
              playsInline
              autoplay="autoplay"
            />
          </li>
        </ul>
      )}
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={drawer.open}
        onClose={() => setDrawer({ ...drawer, open: false, videoLoaded: false })}
        className="relative"
      >
        <video
          src={`${domains.cdn}/status/video_wallet_payments_links_showcase.mp4`}
          // @ts-ignore
          type="video/mp4"
          loading="lazy"
          width="100%"
          loop
          muted
          playsInline
          autoplay="autoplay"
          className={isMobile ? 'w-full' : 'w-160'}
          onLoadedData={() => setDrawer({ ...drawer, videoLoaded: true })}
        />
        {!drawer.videoLoaded && <NmSpinInfinity absoluteXCenter customClass="mx-auto top-1/4 loading-lg scale-150" />}

        <ul className="mx-auto pt-12 pb-6">
          <li>
            <Button
              className="max-md:mx-auto xl:-mt-6 rounded-full shadow-sm w-60 h-12 bg-create-gradient-004"
              size="large"
              variant="contained"
              href="/dashboard"
            >
              Start your Social Pay
            </Button>
          </li>
        </ul>
      </Drawer>
    </StudioLayout>
  )
}
