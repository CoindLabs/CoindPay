import { FC, useState, useMemo } from 'react'
import { Avatar, Link } from '@mui/material'
import classNames from 'classnames'
import randomcolor from 'randomcolor'
import NmIcon from '@/components/nm-icon'
import { useSnackbar } from '@/components/context/snackbar'
import Skus from '@/components/dapp/landing/skus'
import { getHexToRgba } from '@/lib/utils'
import socialConfig from '@/config/common/social'

const { types } = socialConfig

type BlockSocialProps = {
  data?: any
  tpls?: any
  gapX?: string | number
  customClass?: string
  tooltipClass?: string
}

const BlockSocial: FC<BlockSocialProps> = ({ data, tpls, gapX = 6, customClass, tooltipClass, ...props }) => {
  const { showSnackbar } = useSnackbar()
  const { social, font } = Skus[tpls?.style || 'S000']
  const {
    justifyContent = 'justify-center',
    iconBgColor,
    iconColor,
    colorful = false,
    size = 10,
    iconSize = 'text-xl',
  } = social || {}
  const handleSocialManage = item => {
    if (!item?.url && !['website', 'substack'].includes(item?.type)) {
      navigator.clipboard.writeText(item.handle)
      showSnackbar({
        snackbar: {
          open: true,
          text: `${item.type} account copy success ᵔ◡ᵔ`,
        },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      })
    }
  }
  const withColorData = useMemo(() => {
    if (Array.isArray(data)) {
      return data.map((item, index) => {
        let item_active_color =
          (!types[item.type]?.color?.includes('gradient') && types[item.type]?.color) || randomcolor()
        return {
          ...item,
          color: item_active_color,
        }
      })
    }
    return []
  }, [data])

  return (
    data?.length > 0 && (
      <section className={classNames('my-4', customClass)}>
        <ul className={classNames('flex flex-wrap gap-4', `gap-x-${gapX}`, justifyContent)}>
          {withColorData?.map((item, index) => {
            return (
              <li
                key={`social-anim-item-${index}`}
                className={classNames(
                  'md:tooltip tooltip-neutral animate__animated animate__lightSpeedInRight',
                  tooltipClass
                )}
                data-tip={types[item.type]?.name}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                onClick={() => handleSocialManage(item)}
              >
                <Link
                  underline="none"
                  href={['website', 'substack'].includes(item?.type) ? item?.handle : item?.url || undefined}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={font?.color}
                >
                  <Avatar
                    className={`w-${size} h-${size} cursor-pointer`}
                    style={{
                      backgroundColor: colorful ? getHexToRgba(item.color, 0.2) : iconBgColor || 'transparent',
                    }}
                    src={types[item.type]?.image}
                  >
                    {!types[item.type]?.image && (
                      <NmIcon
                        type={`icon-${types[item.type]?.icon}`}
                        className={classNames('hover:scale-125 transition-all duration-500 leading-none', iconSize)}
                        style={{
                          color: colorful ? item.color : iconColor,
                        }}
                      />
                    )}
                  </Avatar>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    )
  )
}

export default BlockSocial
