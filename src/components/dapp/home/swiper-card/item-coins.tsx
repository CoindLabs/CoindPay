import { useEffect, useState } from 'react'
import { Avatar } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper'
import classNames from 'classnames'
import { ChainType, getTokens } from '@lifi/sdk'
import NmSpinInfinity from '@/components/nm-spin/infinity'
import { useMobile } from '@/lib/hooks'
import { isUrl } from '@/lib/utils'

const ItemCoinsSwiper = ({ data = [], ...props }) => {
  const isMobile = useMobile()
  const [loading, setLoading] = useState(false)
  const [tokens, setTokens] = useState([])

  const getTokensList = async isMounted => {
    setLoading(true)

    const chains = {
      1: { chain: 'Ethereum', length: 10 },
      1151111081099710: { chain: 'Solana', length: 50 },
    }
    const lifiChainIds = Object.keys(chains).map(Number)

    try {
      const res = await getTokens({
        chains: lifiChainIds,
        chainTypes: [ChainType.SVM, ChainType.EVM],
      })

      if (isMounted && res?.tokens) {
        const mergedTokens = Object.entries(chains).flatMap(([chainId, { length }]) => {
          const tokensForChain = res.tokens[chainId] || []
          return tokensForChain.slice(0, length)
        })

        setTokens(prevTokens =>
          JSON.stringify(prevTokens) !== JSON.stringify(mergedTokens) ? mergedTokens : prevTokens
        )
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error)
    } finally {
      if (isMounted) setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    getTokensList(isMounted)
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <article className={classNames('text-center', props?.customClass)}>
      {loading ? (
        <NmSpinInfinity customClass="text-lg scale-200" />
      ) : (
        <Swiper
          key={tokens.length}
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
