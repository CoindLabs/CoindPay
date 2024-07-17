import Image from 'next/image'

import config from '@/config'

const { domains } = config

const ContentFooter = () => {
  return (
    <section className="relative">
      <Image
        src={`${domains.cdn}/stream/static/home/content/moments_bg_01.png`}
        width={2000}
        height={1000}
        alt=""
        draggable={false}
        className="absolute -top-[50rem] sm:-top-[36rem] xl:-bottom-96 w-full h-160"
      />
    </section>
  )
}

export default ContentFooter
