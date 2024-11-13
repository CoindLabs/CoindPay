import { useEffect, useState } from 'react'
import { Avatar } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper'
import classNames from 'classnames'
import { ChainType, getTokens } from '@lifi/sdk'
import NmSpinInfinity from '@/components/nm-spin/infinity'
import { useMobile } from '@/lib/hooks'
import { logoChains } from '@/lib/chains'
import { isUrl } from '@/lib/utils'

import config from '@/config'

const { images } = config

const ItemCoinsSwiper = ({ data = [], ...props }) => {
  const isMobile = useMobile()

  const [loading, setLoading] = useState(false)
  const [tokens, setTokens] = useState([])

  const getTokensList = async () => {
    setLoading(true)

    let chains = {
        1: {
          chain: 'Ethereum',
          length: 10,
        },
        1151111081099710: {
          chain: 'Solana',
          length: 50,
        },
      },
      lifiChainIds = Object.keys(chains).map(Number)

    let res = await getTokens({
      chains: lifiChainIds,
      chainTypes: [ChainType.SVM, ChainType.EVM],
    })

    if (res?.tokens) {
      const mergedTokens = Object.entries(chains).reduce((pre, [chainId, { length }]) => {
        const tokensForChain = res.tokens[chainId] || []
        const limitedTokens = tokensForChain.slice(0, length)
        pre.unshift(...limitedTokens)
        return pre
      }, [])

      setTokens(mergedTokens)
    }
    setLoading(false)
  }

  useEffect(() => {
    getTokensList()
  }, [])

  return (
    <article className={classNames('text-center', props?.customClass)}>
      {loading ? (
        <NmSpinInfinity customClass="text-lg scale-200" />
      ) : (
        <Swiper
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
          className={classNames(props?.swiperClass)}
        >
          {tokens.map((item, index) =>
            isUrl(item?.logoURI) && !item?.logoURI?.endsWith('svg') ? (
              <SwiperSlide key={`coin-item-${item?.address || item?.name}-${index}`} className="!w-auto">
                <Avatar
                  src={item?.logoURI}
                  className={classNames(
                    'shadow-sm size-12 hover:rotate-y-360 duration-1000 transition-all',
                    {
                      'opacity-40': item?.disabled,
                    },
                    props?.avatarClass
                  )}
                />
              </SwiperSlide>
            ) : null
          )}
        </Swiper>
      )}
    </article>
  )
}

export default ItemCoinsSwiper
