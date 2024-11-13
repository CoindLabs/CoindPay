import Image from 'next/image'
import { Box } from '@mui/material'
import LandingCard from '@/components/dapp/landing/base/card'
import { FlipWords } from '@/components/aceternity-ui/flip-words'
import ItemCoinsSwiper from './swiper-card/item-coins'

import config from '@/config'

const { domains } = config

let animateWords = ['Business', 'Invoice', 'Checkout', 'Recurring', 'Connect']

const ContentChains = () => {
  return (
    <section className="relative -mt-8">
      <Image
        src={`${domains.cdn}/stream/static/home/content/icons_tick_01.png`}
        width={200}
        height={200}
        alt=""
        draggable={false}
        className="size-28 md:size-40 xl:size-44 absolute -top-16 sm:-top-20 left-4"
      />

      <Box className="text-gray-100 px-6 py-14 sm:pt-36 lg:pt-56 xl:pt-72 sm:absolute">
        <h1 className="leading-normal text-3xl lg:text-5xl 2xl:text-6xl font-poppins font-semibold animate__animated animate__slideInDown">
          <strong>All Your</strong>
          <FlipWords words={animateWords} className="pl-2" />
          <p className="leading-loose">Payments in One Place</p>
        </h1>
        <p className="text-neutral-500 pt-6 sm:max-w-sm lg:max-w-lg">
          Make the movement of encrypted funds simpler and more efficient.
          <br />
          Make idle funds more available once and for all.
        </p>
      </Box>

      <Image
        src="https://assets-global.website-files.com/642ed403044d8378fabb82a6/646b576db9e3c779d4be4782_XJBmAcDq_4x%20(1).webp"
        width={2000}
        height={1200}
        sizes="100vw"
        alt=""
        draggable={false}
      />
      <LandingCard
        customClass="-mt-0 sm:-mt-12 mx-4 border border-zinc-700/30"
        tpls={{ style: 'S001' }}
      >
        <ItemCoinsSwiper />
      </LandingCard>
    </section>
  )
}

export default ContentChains
