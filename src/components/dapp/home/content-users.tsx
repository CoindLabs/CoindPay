import Image from 'next/image'
import { Box, Button, useMediaQuery } from '@mui/material'
import NmIcon from '@/components/nm-icon'

import config from '@/config'

const { domains } = config

const ContentUsers = () => {
  let mdScreen = useMediaQuery('(min-width:768px)'),
    lgScreen = useMediaQuery('(min-width:1024px)')

  return (
    <section className="relative">
      <Box className="text-gray-100 p-14 pb-0 pr-0 max-sm:px-6 sm:pt-32 sm:absolute sm:max-lg:max-w-96 lg:max-xl:max-w-md">
        <h1 className="text-3xl lg:text-5xl 2xl:text-6xl font-poppins font-semibold">
          <strong className="leading-normal">Ready to get started?</strong>
        </h1>
        <p className="text-neutral-500 pt-6 sm:max-w-sm lg:max-w-lg">
          Create an account instantly to get started or contact us to design a custom encrypted payments and business
          growth program for your business or brand.
        </p>
        <Button
          variant="contained"
          size="large"
          color="success"
          className="group text-black mt-8 py-3 text-lg w-full sm:max-w-md bg-theconvo-gradient-001 bg-cover"
          href="/dashboard"
        >
          Build with us
          <NmIcon
            type="icon-arrow_right"
            className="hidden group-hover:inline absolute right-1 animate__animated animate__fadeInLeft animate__infinite animate__slow"
          />
        </Button>
        <footer className="pt-28 max-sm:hidden">
          <h1 className="text-gray-100 leading-normal text-2.5xl font-poppins font-semibold">
            <strong>Partners and Services</strong>
          </h1>
        </footer>
      </Box>
      <Image
        sizes="100vw"
        draggable={false}
        width={1600}
        height={900}
        alt=""
        src={
          (lgScreen &&
            'https://assets-global.website-files.com/642ed403044d8378fabb82a6/646b575058c24f745d1f1f5b_high-quality%20image-min.webp') ||
          (mdScreen &&
            'https://assets-global.website-files.com/642ed403044d8378fabb82a6/646c7ce121d9bb039384547f_Frame%201597879799%20(1).webp') ||
          'https://assets-global.website-files.com/642ed403044d8378fabb82a6/646ba17ee519b92c48b446a8_Frame%201597880100.webp'
        }
      />
      <Image
        src={`${domains.cdn}/stream/static/home/content/moments_bg_01.png`}
        width={2000}
        height={1000}
        alt=""
        draggable={false}
        className="absolute -bottom-[50rem] sm:-bottom-[36rem] xl:-bottom-96 w-full h-160"
      />
    </section>
  )
}

export default ContentUsers
