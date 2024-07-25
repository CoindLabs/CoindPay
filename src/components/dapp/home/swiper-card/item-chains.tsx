import classNames from 'classnames'
import { Avatar } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper'
import { useMobile } from '@/lib/hooks'
import { _supportChains } from '@/lib/chains'

const ItemChainsSwiper = ({ data = [], ...props }) => {
  const isMobile = useMobile()

  return (
    <Swiper
      loop
      grabCursor
      slidesPerView="auto"
      spaceBetween={isMobile ? 28 : 40}
      speed={2000}
      autoplay={{
        delay: 1000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      modules={[Autoplay]}
      className={classNames(props?.customClass)}
    >
      {_supportChains.map((item, index) => {
        return (
          <SwiperSlide key={`chain-item-${item?.type || item?.name}-${index}`} className="!w-auto">
            <Avatar
              src={item?.icon || `https://icons.llamao.fi/icons/chains/rsz_${item?.name?.toLowerCase()}?w=100&h=100`}
              className={classNames(
                'bg-transparent shadow-sm size-12 hover:rotate-y-360 duration-1000 transition-all',
                {
                  'opacity-40': item?.disabled,
                },
                props?.avatarClass
              )}
            />
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}

export default ItemChainsSwiper
