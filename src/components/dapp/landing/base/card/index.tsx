import React, { FC, ReactNode, useState } from 'react'
import classNames from 'classnames'
import { Box, IconButton } from '@mui/material'
import Skus from '@/components/dapp/landing/skus'
import NmTooltip from '@/components/nm-tooltip'
import NmIcon from '@/components/nm-icon'
import { useSnackbar } from '@/components/context/snackbar'
import { useLocation } from '@/lib/hooks'

import Wrap, { Props as WrapProps } from './wrap'

type LandingCardProps = {
  title?: string | ReactNode | undefined // 标题
  titleClass?: String //标题自定义样式
  titleExtra?: ReactNode // 标题右补充信息
  children?: ReactNode // 嵌套元素
  innerClass?: string // 内容区盒子自定义样式
  headerClass?: string // 盒子头自定义样式
  blockId?: String // 分享卡片的顺序
  showCopy?: Boolean
  onCardClick?: () => void
  onTitleExtraClick?: () => void
}

const LandingCard: FC<LandingCardProps & WrapProps> = ({
  tpls,
  title,
  children,
  hoverAnimation,
  customClass,
  innerClass,
  headerClass,
  blockId,
  showCopy,
  onCardClick,
  onTitleExtraClick,
  ...props
}) => {
  const { showSnackbar } = useSnackbar()

  const origin = useLocation('origin')
  const pathname = useLocation('pathname')
  const { font, card = {} } = Skus[tpls?.style || 'S000']
  const { justifyContent = 'justify-between' } = card

  const handleCopyShareURL = () => {
    navigator.clipboard.writeText(`${origin}${pathname}?utm_card_code=${blockId}`)
    showSnackbar({
      snackbar: {
        open: true,
        type: 'success',
        text: 'Card url copy successsss ᵔ◡ᵔ',
      },
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'left',
      },
    })
  }

  return (
    <Wrap
      hoverAnimation={hoverAnimation}
      component={props?.component || 'article'}
      customClass={classNames('card card-compact my-8 p-4', customClass)}
      tpls={tpls}
      onClick={onCardClick}
    >
      <Box className={classNames('z-0 size-full', innerClass)}>
        {(title || showCopy || props?.titleExtra) && (
          <header className={classNames('flex items-center h-7 mb-6 relative group', headerClass, justifyContent)}>
            {title &&
              (typeof title == 'string' ? (
                <span className={classNames('text-xl font-medium truncate', props?.titleClass)}>{title}</span>
              ) : (
                title
              ))}
            {(showCopy || props?.titleExtra) && (
              <Box className="flex items-center gap-1.5 justify-end absolute right-0">
                {showCopy && (
                  <NmTooltip title="Copy">
                    <IconButton size="small">
                      <NmIcon
                        type="icon-share"
                        className={classNames(
                          'scale-120 transition-all leading-0 opacity-0 group-hover:opacity-70',
                          font?.color
                        )}
                        onClick={handleCopyShareURL}
                      />
                    </IconButton>
                  </NmTooltip>
                )}
                {props?.titleExtra && (
                  <Box className="leading-0 cursor-pointer" onClick={onTitleExtraClick}>
                    {props?.titleExtra}
                  </Box>
                )}
              </Box>
            )}
          </header>
        )}
        {children}
      </Box>
    </Wrap>
  )
}

export default LandingCard
