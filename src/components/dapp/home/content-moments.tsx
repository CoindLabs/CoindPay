import { Box } from '@mui/material'
import Typewriter from 'typewriter-effect'

import config from '@/config'

const { domains } = config

const ContentMoments = () => {
  return (
    <section className="py-28 text-center overflow-hidden">
      <Typewriter
        component="header"
        options={{
          wrapperClassName: 'text-6.5xl sm:text-8xl lg:text-9xl !leading-normal font-righteous',
          cursorClassName: 'text-6.5xl sm:text-8xl lg:text-9xl !leading-normal text-transparent',
          autoStart: true,
          loop: true,
        }}
        onInit={typewriter => {
          typewriter
            .pauseFor(100)
            .typeString(`<span class='bg-clip-text text-transparent bg-create-gradient-002 pr-3 lg:pr-5'>For</span>`)
            .pauseFor(200)
            .typeString(
              `<span class='bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500'>Creators</span>`
            )
            .pauseFor(1000)
            .deleteChars(8)
            .typeString(
              `<span class='bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500'>Brands</span>`
            )
            .pauseFor(1000)
            .deleteChars(6)
            .typeString(
              `<span class='max-sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500'>Consumers</span>`
            )
            .pauseFor(1000)
            .deleteChars(9)
            .typeString(
              `<span class='max-sm:text-5.5xl bg-clip-text text-transparent bg-create-gradient-002'>Everyone.</span>`
            )
            .pauseFor(3000)
            .start()
        }}
      />
      <Box className="w-full relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
      </Box>
      <p className="text-xl sm:text-2xl pt-12 text-neutral-600 font-chillax">
        Accelerating the Mass Adoption of Web3 Finance Payments to Consumers and Lifestyles.
      </p>
    </section>
  )
}

export default ContentMoments
