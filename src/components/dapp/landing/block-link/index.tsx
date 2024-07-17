import { ReactNode, memo, useState } from 'react'
import classNames from 'classnames'
import { Avatar, Box, Link } from '@mui/material'
import NmIcon from '@/components/nm-icon'
import CropImg from '@/components/nm-crop/crop-img'
import Skus, { TplsProps } from '@/components/dapp/landing/skus'
import LandingCard from '@/components/dapp/landing/base/card'
import { getBlocksUrlFactory } from '@/lib/utils'

interface DataProps {
  url?: string
  name?: string
  image?: any
  emoji?: string
  pay?: boolean
}

interface LinkProps {
  text?: string | null
  imgSrc?: string
  imgStyle?: object
  share?: boolean
  customClass?: string
  avatarClass?: string
  nameClass?: string
  href?: string
  target?: string
  rightIcon?: ReactNode | boolean
  blockId?: string
  tpls?: TplsProps //对应模板、主题等结构体
  user?: object
  avatar?: string
  firstPay?: boolean
  data?: DataProps
}

const BlockLink = (
  {
    text,
    imgSrc,
    imgStyle,
    share = false,
    customClass,
    avatarClass,
    nameClass,
    href,
    target = '_blank',
    rightIcon,
    tpls,
    user = {},
    avatar,
    firstPay,
    data,
  }: LinkProps,
  ...props
) => {
  const [expand, setCardExpand] = useState(firstPay || false)

  const { font, link } = Skus[tpls?.style || 'S000']
  const { radius = 'rounded-full' } = link || {}

  let image = imgSrc || data?.image?.url || data?.image,
    imageStyle = imgStyle || data?.image?.imgStyle,
    name = text || data?.name || data['title']

  if (!(name || data?.url)) return null

  const contentAvatar = ({ classes = null } = {}) =>
    (image || data?.emoji) && (
      <Box className={classNames('size-11 text-2.5xl', radius, classes)}>
        {image ? (
          <CropImg customClass={classNames(radius, avatarClass)} src={image} imgStyle={imageStyle} />
        ) : (
          name && <span className="ml-2 hover:scale-105 transition-all">{data?.emoji}</span>
        )}
      </Box>
    )

  const contentTitle = ({ classes = null } = {}) =>
    (name || data?.emoji) && (
      <h2
        className={classNames(
          'px-2 text-center flex-1 truncate hover:scale-105 transition-all',
          {
            'pr-7': !expand,
          },
          nameClass,
          classes
        )}
      >
        {name || <span className="text-2xl">{data?.emoji}</span>}
      </h2>
    )

  const linkContent = (
    <LandingCard
      customClass={classNames(
        radius,
        'px-2 mx-auto group transition-all',
        expand ? 'h-auto' : 'h-14',
        data?.pay ? 'relative z-2' : '',
        {
          '!rounded-2xl': expand,
        },
        customClass
      )}
      tpls={tpls}
    >
      {expand ? (
        <Box />
      ) : (
        <article
          className="h-full flex items-center justify-between relative cursor-pointer"
          onClick={() => {
            if (data?.pay) {
              setCardExpand(!expand)
            }
          }}
        >
          {contentAvatar()}
          {contentTitle()}
          {data?.pay ? (
            <NmIcon
              type="icon-push_left"
              className="text-xl leading-0 absolute right-3 animate__animated animate__fadeInRight animate__slow animate__infinite"
            />
          ) : (
            rightIcon && (
              <NmIcon
                type="icon-arrow_right"
                className="hidden group-hover:inline absolute right-0 animate__animated animate__fadeInLeft animate__infinite"
              />
            )
          )}
          {share && (
            <Avatar className={classNames('absolute right-0 size-11 bg-black/90', avatarClass)}>
              <NmIcon type="icon-share" className="text-2xl mb-0.5" />
            </Avatar>
          )}
        </article>
      )}
    </LandingCard>
  )

  return data?.pay ? (
    linkContent
  ) : (
    <Link
      underline="none"
      href={href || getBlocksUrlFactory(data?.url) || undefined}
      target={target}
      rel="noopener noreferrer nofollow"
    >
      {linkContent}
    </Link>
  )
}

export default memo(BlockLink)
