import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Avatar, Box, Button, Drawer } from '@mui/material'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { formatUnits } from 'viem'
import { CountUp } from 'use-count-up'
import StudioLayout from '@/components/layout/studio'
import NmIcon from '@/components/nm-icon'
import NmTooltip from '@/components/nm-tooltip'
import NmSpinInfinity from '@/components/nm-spin/infinity'
import { FlipWords } from '@/components/aceternity-ui/flip-words'
import ItemChainsSwiper from '@/components/dapp/home/swiper-card/item-chains'
import {
  get1InchTokenSvc,
  getJupTokenPriceSvc,
  getMoralisTokenSvc,
  getSolTokenListSvc,
  getSushiTokenSvc,
} from '@/services/common'
import { getPaymentOrderSvc } from '@/services/pay'
import { useMobile, useUserData } from '@/lib/hooks'
import { getNFTOrScanUrl, getShortenMidDots } from '@/lib/utils'
import { _supportChains, payChains } from '@/lib/chains'
import { getActiveChain } from '@/lib/web3'
import * as pay from '@/lib/chains/tokens'

import config from '@/config'

let animateWords = ['Business', 'Invoice', 'Checkout', 'Recurring', 'Connect']

const { ethereum, base, optimism, arbitrum, bsc, polygon, zkSync, aurora, zeta } = pay
const { domains } = config

export default function Dashboard() {
  const isMobile = useMobile()
  const user = useUserData()
  const router = useRouter()
  const tokensCache = useRef([
    ...ethereum.list,
    ...base.list,
    ...optimism.list,
    ...arbitrum.list,
    ...bsc.list,
    ...polygon.list,
    ...zkSync.list,
    ...aurora.list,
    ...zeta.list,
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
      let solList = res?.data?.filter(row => row?.chain?.includes('Solana')),
        ethList = res?.data?.filter(row => row?.chain?.includes('Ethereum')),
        baseList = res?.data?.filter(row => row?.chain?.includes('Base') || payChains[2]?.['chainId'] == row?.chainId),
        opList = res?.data?.filter(row => row?.chain?.includes('Optimism')),
        arbList = res?.data?.filter(row => row?.chain?.includes('Arbitrum')),
        bscList = res?.data?.filter(row => row?.chain?.includes('BSC')),
        polygonList = res?.data?.filter(row => row?.chain?.includes('Polygon')),
        zkSyncList = res?.data?.filter(row => row?.chain?.includes('zkSync')),
        auroraList = res?.data?.filter(row => row?.chain?.includes('Aurora')),
        zetaList = res?.data?.filter(row => row?.chain?.includes('Zeta'))

      let chainIdProd = name => payChains.find(row => row.name.includes(name))?.['chainIdProd']

      if (solList?.length) {
        await getJupTokenPrice({
          ids: [...new Set(solList.map(item => item.symbol))].join(','),
        })
      }
      if (ethList?.length) {
        await get1InchTokenPrice([...new Set(ethList.map(item => item.contract))], chainIdProd('Ethereum'))
      }
      if (baseList?.length) {
        await get1InchTokenPrice([...new Set(baseList.map(item => item.contract))], chainIdProd('Base'))
      }
      if (opList?.length) {
        await get1InchTokenPrice([...new Set(opList.map(item => item.contract))], chainIdProd('Optimism'))
      }
      if (arbList?.length) {
        await get1InchTokenPrice([...new Set(arbList.map(item => item.contract))], chainIdProd('Arbitrum'))
      }
      if (bscList?.length) {
        await get1InchTokenPrice([...new Set(bscList.map(item => item.contract))], chainIdProd('BSC'))
      }
      if (polygonList?.length) {
        await get1InchTokenPrice([...new Set(polygonList.map(item => item.contract))], chainIdProd('Polygon'))
      }
      if (zkSyncList?.length) {
        await get1InchTokenPrice([...new Set(zkSyncList.map(item => item.contract))], chainIdProd('zkSync'))
      }
      if (auroraList?.length) {
        await get1InchTokenPrice([...new Set(auroraList.map(item => item.contract))], chainIdProd('Aurora'))
      }
      if (zetaList?.length) {
        await getSushiTokenPrice([...new Set(zetaList.map(item => item.contract))], chainIdProd('Zeta'))
      }

      paymentsListCache.current = res?.data
      setPaymentsData({
        list: res?.data,
        total: res?.data?.reduce(
          (total, item) =>
            total + item.amount * (handleTokenPriceFactory(item?.symbol) || handleTokenPriceFactory(item?.contract)),
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

  const getJupTokenPrice = async ({ ids }) => {
    let res = await getJupTokenPriceSvc({ ids })
    if (res?.data) {
      tokensPrice.current = Object.assign(tokensPrice.current, res?.data)
    }
  }

  const get1InchTokenPrice = async (address, chainId) => {
    if (address?.length) address = address.join(',')
    let res = await get1InchTokenSvc({
      chainId,
      address,
    })
    if (res) tokensPrice.current = Object.assign(tokensPrice.current, res)
  }

  const getSushiTokenPrice = async (addresses, chainId) => {
    try {
      const requests = addresses.map(address =>
        getSushiTokenSvc({
          chainId,
          tokenIn: address,
          tokenOut: payChains.find(row => row?.['chainId'] === chainId)?.['mocks']?.usdc,
          amount: 1000000000000000000,
        })
          .then(res => {
            if (res?.assumedAmountOut) {
              return {
                address,
                price: Number(formatUnits(res.assumedAmountOut, 6)),
              }
            }
          })
          .catch(error => {
            console.error(`Error fetching price for address ${address}:`, error)
            return null
          })
      )

      const results = await Promise.all(requests)

      results.forEach(result => {
        if (result) {
          tokensPrice.current = {
            ...tokensPrice.current,
            [result.address]: result.price,
          }
        }
      })
    } catch (error) {
      console.error('Error in getSushiTokenPrice:', error)
    }
  }

  /**
   * Token price by Moralis（某些链不支持，暂时放弃该方案）
   * @param token list
   */
  const getMoralisTokenPrice = async (tokens = null) => {
    let res = await getMoralisTokenSvc(
      {
        type: 'getMultipleTokenPrices',
        tokens,
      },
      {
        chain: payChains[chainIndex]?.['chainNamePrice'],
      }
    )
    if (res?.ok && res?.data?.length) {
      const tokenAddressObj = res?.data.reduce((acc, item) => {
        const { tokenAddress, ...rest } = item
        acc[tokenAddress] = rest
        return acc
      }, {})
      tokensPrice.current = Object.assign(tokensPrice.current, tokenAddressObj)
    }
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
    tokensPrice.current?.[key]?.price ||
    tokensPrice.current?.[key?.toLowerCase()]?.price ||
    tokensPrice.current?.[key]?.usdPrice ||
    tokensPrice.current?.[key?.toLowerCase()]?.usdPrice ||
    tokensPrice.current?.[key] ||
    tokensPrice.current?.[key?.toLowerCase()]

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
      <ItemChainsSwiper customClass="my-12" />
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
      <ul className="carousel gap-6 py-8 w-full items-center">
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
                item?.disabled ? 'cursor-not-allowed opacity-20' : 'cursor-pointer',
                {
                  'bg-black p-1.5': item?.name
                    .split(' ')
                    .some(word => ['Solana', 'Arbitrum', 'BSC', 'Polygon', 'Aurora'].includes(word)),
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
      </ul>
      {loading ? (
        <Box className="mt-16 mx-auto text-center">
          <NmSpinInfinity customClass="loading-lg scale-150" />
        </Box>
      ) : payments.list?.length > 0 ? (
        <table className="table table-lg">
          <thead className="text-neutral-400 text-base">
            <tr>
              {['From', 'Chain', 'Date', 'Amount'].map((row, index) => (
                <th
                  key={`table-head-${index + 1}`}
                  className="font-normal px-0 text-center first:text-left [&:nth-child(2)]:text-left last:text-right"
                >
                  {row}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.list?.map((item, index) => {
              let tokenItem = tokensCache.current.find(
                row => row?.address == item?.contract && row.symbol?.toLowerCase() == item?.symbol?.toLowerCase()
              )
              let chainIcon = ({ classes = null } = {}) => (
                <Image
                  alt=""
                  width={36}
                  height={36}
                  src={
                    _supportChains.find(row => item?.chain?.includes(row?.name))?.icon ||
                    `https://icons.llamao.fi/icons/chains/rsz_${item?.chain?.toLowerCase()}?w=100&h=100`
                  }
                  className={classNames('rounded-full', classes)}
                />
              )
              return (
                <tr key={`table-body-row-${index + 1}`}>
                  <td className="px-0 text-neutral-800 min-w-40">
                    <ul className="flex gap-2">
                      <li className="pt-1 relative">
                        <Avatar src={tokenItem?.logoURI} className="max-sm:size-8" />
                        {chainIcon({
                          classes: classNames('size-4 sm:size-5 border absolute top-0 right-0', {
                            'bg-white': ['Arbitrum', 'BSC', 'Polygon', 'Aurora'].includes(item?.chain),
                            'bg-black': item?.chain == 'Solana',
                          }),
                        })}
                      </li>
                      <li className="max-sm:max-w-40 xl:max-w-2xl">
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
                  </td>
                  <td className="px-0 text-center">
                    <NmTooltip title={item.chain}>{chainIcon({ classes: 'size-8' })}</NmTooltip>
                  </td>
                  <td className="px-0 text-center text-neutral-800/60 max-sm:text-sm">
                    {dayjs(item?.createdAt).format('YYYY-MM-DD HH:mm')}
                  </td>
                  <td className="px-0 text-right">
                    <ul>
                      <li className="bg-clip-text text-transparent bg-create-gradient-004">
                        + {item.amount} {tokenItem?.symbol || item?.symbol}
                      </li>
                      <li className="text-neutral-800/50 text-sm">
                        ≈
                        <span className="px-0.5">
                          {Number(
                            (
                              item.amount *
                              (handleTokenPriceFactory(item?.symbol) || handleTokenPriceFactory(item?.contract))
                            ).toFixed(3)
                          )}
                        </span>
                        USD
                      </li>
                    </ul>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <ul className="pt-4">
          <li className="flex gap-8 justify-center items-center">
            <h2 className="text-2xl md:text-3xl bg-clip-text text-transparent bg-create-gradient-004 font-righteous">
              Now start your first crypto payment.
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
