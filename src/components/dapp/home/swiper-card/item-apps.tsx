import { useState } from 'react'
import Image from 'next/image'
import classNames from 'classnames'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper'

import config from '@/config'

const { domains } = config

const ItemAppsSwiper = ({ data = [], ...props }) => {
  const [socialSkeleton, setSocialSkeleton] = useState(true)

  return (
    <Swiper
      dir={props?.dir}
      slidesPerView={6}
      spaceBetween={12}
      modules={[Autoplay, FreeMode]}
      freeMode
      grabCursor
      loop
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      breakpoints={{
        750: {
          slidesPerView: 8,
        },
        1024: {
          slidesPerView: 12,
        },
        1600: {
          slidesPerView: 18,
        },
      }}
      className="w-full my-12 xl:my-16"
      key={`social-row-${props?.index}`}
    >
      {data.map((row, index) => {
        return (
          <SwiperSlide key={`item_apps_${index}`}>
            <Image
              alt=""
              src={`${domains.cdn}/static/${row?.type || 'social'}/${row?.icon}`}
              width="100"
              height="100"
              className={classNames(
                'rounded size-11 2xl:size-13 hover:rotate-y-360 duration-1000 transition-all',
                props?.class,
                {
                  skeleton: socialSkeleton,
                  'opacity-30': row?.disabled,
                }
              )}
              onLoadingComplete={e => {
                if (socialSkeleton) e.naturalWidth && setSocialSkeleton(false)
              }}
            />
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}

export default ItemAppsSwiper
