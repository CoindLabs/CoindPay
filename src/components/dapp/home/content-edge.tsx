import Image from 'next/image'
import classNames from 'classnames'
import { Box, Avatar, Chip } from '@mui/material'
import NmIcon from '@/components/nm-icon'
import LandingCard from '@/components/dapp/landing/base/card'
import ItemChainsSwiper from './swiper-card/item-chains'
import { _supportChains } from '@/lib/chains'
import { getActiveChain } from '@/lib/web3'

import config from '@/config'

const { title, domains } = config

let chainsPayments = [
  {
    name: 'Solana',
    title: '+ 7.52 SOL',
    titleClass: 'text-green-500 bg-green-500/30',
    message: 'Hey Jack. I subscribed your course, great marketing analysis.',
    icon: 'subscribed',
    iconClass: 'text-green-500',
  },
  {
    name: 'ICP',
    title: '+ 120 ICP',
    titleClass: 'text-rose-600 bg-rose-600/20',
    message: "Last month's salary from the Dev DAO community.",
    icon: 'salary',
    iconClass: 'text-rose-600',
  },
  {
    name: 'Base',
    title: '+ 0.25 ETH',
    titleClass: 'text-blue-600 bg-blue-600/20',
    message: 'Received a reward from 0x.... .9h8c a reward.',
    icon: 'gift',
    iconClass: 'text-blue-600 scale-90',
  },
  {
    name: 'Optimism',
    title: '+ 25 USDC',
    titleClass: 'text-violet-600 bg-violet-600/20',
    message: 'Received a donation grant from 7Th...vDw.',
    icon: 'donation',
    iconClass: 'text-violet-600',
  },
  {
    name: 'zkSync',
    title: '+ 9 DAI',
    titleClass: 'text-orange-600 bg-orange-600/20',
    message: '0x...8c2m Buy you a cup of coffee.',
    icon: 'buymeacoffee',
    iconClass: 'text-orange-600',
  },
  {
    name: 'Arbitrum',
    title: '+ 5.6 ARB',
    titleClass: 'text-sky-600 bg-sky-600/20',
    message: 'Received a transfer (bounty) from 0x...k9.',
    icon: 'bank',
    iconClass: 'text-sky-600 scale-90',
  },
]

const ContentEdge = () => {
  return (
    <section className="py-12 px-4 sm:px-8 lg:px-12">
      <ul className="flex gap-6 flex-wrap">
        <li className="flex-1">
          <ul>
            <LandingCard
              component="li"
              customClass="p-6 border border-zinc-700/30"
              innerClass="relative flex items-center justify-between gap-8 max-sm:flex-wrap"
              tpls={{ style: 'S002' }}
            >
              <Box className="sm:-mt-12">
                <h1>
                  <strong className="text-4xl 2xl:text-5xl font-poppins">Multichain</strong>
                  <span className="text-1.5xl 2xl:text-2xl pl-2">payments</span>
                </h1>
                <p className="text-neutral-500 pt-6">
                  Cross-chain Pay, get paid, grow a business, and more. <br />
                  More friendly receipts and payments from 20+ chains assets, more options for customers and friends.
                </p>
              </Box>
              <Box className="h-90 carousel carousel-vertical">
                {chainsPayments.map((item, index) => (
                  <LandingCard
                    tpls={{ style: 'S003' }}
                    key={`chain_payment_0${index + 1}`}
                    customClass="carousel-item mt-0 mb-4"
                    innerClass="flex justify-between gap-4"
                  >
                    <Box className="flex gap-4">
                      <Avatar src={item?.['avatar'] || getActiveChain({ name: item?.name })?.icon} />
                      <ul>
                        {item?.title && (
                          <li>
                            <Chip
                              label={item?.title}
                              color="primary"
                              className={classNames('rounded-md border-0 font-medium', item?.titleClass)}
                              variant="outlined"
                            />
                          </li>
                        )}
                        {item?.message && <li className="pt-1 text-sm line-clamp-2">{item?.message}</li>}
                      </ul>
                    </Box>
                    {item?.icon && (
                      <NmIcon
                        type={`icon-${item?.icon}`}
                        className={classNames('text-4xl leading-0 self-end', item?.iconClass)}
                      />
                    )}
                  </LandingCard>
                ))}
              </Box>
              <Box className="w-full absolute bottom-0 -z-1">
                <ItemChainsSwiper customClass="opacity-50 hover:opacity-100 mb-2" />
              </Box>
            </LandingCard>
            <LandingCard
              component="li"
              customClass="p-6 max-xl:mb-2 border border-zinc-700/30"
              tpls={{ style: 'S002' }}
            >
              <ul className="flex max-sm:flex-wrap items-center gap-8">
                <li className="min-w-72 lg:min-w-80">
                  <Image
                    draggable={false}
                    className="animate__animated animate__fadeIn"
                    width={600}
                    height={600}
                    alt=""
                    src={`${domains.cdn}/stream/static/home/content/edge_icons_01.png`}
                  />
                </li>
                <li>
                  <h1>
                    <strong className="text-4xl 2xl:text-5xl font-poppins">Fast & Safe</strong>
                    <span className="text-1.5xl 2xl:text-2xl pl-2">funds</span>
                  </h1>
                  <p className="text-neutral-500 pt-6">
                    Timely payment. No T+1 or T+3...
                    <br />
                    We have partners from service providers like Coinbase Pay, Solana Pay, and others, with strong
                    wallet security and KYC technology to avoid witch attacks and malicious transfers.
                  </p>
                </li>
              </ul>
            </LandingCard>
          </ul>
        </li>
        <LandingCard
          component="li"
          customClass="w-full xl:w-120 3xl:w-144 max-xl:mt-0 p-6 border border-zinc-700/30 overflow-hidden flex"
          tpls={{ style: 'S002' }}
        >
          <Image
            draggable={false}
            className="animate__animated animate__fadeIn absolute right-0"
            width={500}
            height={500}
            alt=""
            src="https://assets-global.website-files.com/642ed403044d8378fabb82a6/644f5895442c99b19bc90273_BG.svg"
          />
          <Image
            draggable={false}
            className="animate__animated animate__fadeInUp animate__infinite animate__slower animate-duration-6 absolute right-0"
            width={600}
            height={600}
            alt=""
            src="https://assets-global.website-files.com/642ed403044d8378fabb82a6/644f5895442c99b19bc90273_BG.svg"
          />
          <ul className="h-full flex flex-col justify-end max-sm:pt-64">
            <li className="sm:max-xl:max-w-1/2 sm:max-xl:py-4">
              <h1>
                <strong className="text-4xl 2xl:text-5xl font-poppins">Compound X</strong>
                <span className="text-1.5xl 2xl:text-2xl pl-2">markets</span>
              </h1>
              <p className="text-neutral-500 pt-6">
                All payments automatically flow into smart contracts like Compound and Lido, which continue to compound
                and revitalize the pool of money for creators and merchants.
                <br />
                Audited and Verified. The most secure protocol for money.
              </p>
            </li>
            <li className="py-2 pt-8">
              <ul className="flex flex-wrap gap-4">
                {['lido', 'maker', 'aave', 'compound'].map((row, index) => (
                  <li
                    className="p-2.5 flex-1 min-w-36 flex items-center justify-between rounded-lg border border-zinc-700"
                    key={`${row}-${index}`}
                  >
                    <Image
                      className="rounded-full max-sm:size-10"
                      src={`${domains.cdn}/static/social/${row}.png`}
                      width={44}
                      height={44}
                      alt=""
                      draggable={false}
                    />
                    <strong className="capitalize">{row}</strong>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </LandingCard>
        <LandingCard component="li" customClass="w-full p-6 !-mt-6 border border-zinc-700/30" tpls={{ style: 'S002' }}>
          <ul className="flex justify-center sm:justify-between max-sm:flex-wrap items-center gap-8">
            <li className="sm:max-w-1/2">
              <h1>
                <strong className="text-4xl 2xl:text-5xl font-poppins">Ecosystem</strong>
                <span className="text-1.5xl 2xl:text-2xl pl-2">developers</span>
              </h1>
              <p className="text-neutral-500 pt-6">
                No-code payment configuration, intelligent widgets. free to share with anyone.
                <br />
                SDK support for embedded development.
              </p>
            </li>
            <li>
              <Image
                draggable={false}
                className="animate__animated animate__fadeIn"
                width={300}
                height={300}
                alt=""
                src={`${domains.cdn}/stream/static/home/content/edge_icons_02.png`}
              />
            </li>
          </ul>
        </LandingCard>
      </ul>
    </section>
  )
}

export default ContentEdge
