import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Box, useMediaQuery } from '@mui/material'
import classNames from 'classnames'
import { FlipWords } from '@/components/aceternity-ui/flip-words'

import config from '@/config'

const { domains } = config

let animateWords = ['Payments', 'Compound', 'Liquidity', 'All-in-One']

const Banner = () => {
  const [animateInit, setAnimateInit] = useState(true)
  let lgScreen = useMediaQuery('(min-width:1024px)'),
    xlScreen = useMediaQuery('(min-width:1280px)')

  useEffect(() => {
    setTimeout(_ => {
      setAnimateInit(false)
    }, 1500)
  }, [animateInit])

  return (
    <section className="relative flex justify-center max-sm:mb-28 min-h-120">
      <header className="absolute z-1 -bottom-36 sm:top-80 xl:top-56 font-righteous text-3xl sm:text-5.5xl lg:text-6.5xl text-white text-center">
        <Box className="text-3.5xl sm:text-5.5xl lg:text-6.5xl">
          <span>Crypto</span>
          <FlipWords words={animateWords} className="pl-4" />
        </Box>
        <p className="leading-loose sm:pt-2">Infrastructure for Finance</p>
      </header>
      <Image
        draggable={false}
        className="w-full"
        width={2400}
        height={1200}
        alt=""
        src={
          (xlScreen && `${domains.cdn}/stream/static/home/gateway/banner_bg_01.jpg`) ||
          (lgScreen && `${domains.cdn}/stream/static/home/gateway/banner_bg_02.jpg`) ||
          `${domains.cdn}/stream/static/home/gateway/banner_bg_03.jpg`
        }
      />
      <Image
        draggable={false}
        className={classNames(
          'w-38 md:w-64 lg:w-84 xl:w-100 2xl:w-120 3xl:w-136 absolute bottom-28 md:bottom-40 xl:bottom-36 left-0 xl:left-16 animate__animated',
          animateInit
            ? 'animate__fadeInBottomLeft animate__slow'
            : 'animate__jello animate__delay-1s animate__slower animate-duration-8 animate__infinite'
        )}
        width={800}
        height={800}
        alt=""
        src={`${domains.cdn}/stream/static/home/gateway/banner_icons_01.png`}
      />
      <Image
        draggable={false}
        className={classNames(
          'w-32 md:w-56 lg:w-72 xl:w-84 2xl:w-100 3xl:w-120 absolute bottom-16 right-2 lg:right-12 xl:right-28 animate__animated',
          animateInit
            ? 'animate__fadeInBottomRight animate__slow'
            : 'animate__pulse animate__delay-1s animate__slower animate-duration-6 animate__infinite'
        )}
        width={800}
        height={800}
        alt=""
        src={`${domains.cdn}/stream/static/home/gateway/banner_icons_02.png`}
      />
    </section>
  )
}

export default Banner
