import React, { FC, PropsWithChildren } from 'react'
import { Box, BoxProps } from '@mui/material'
import classNames from 'classnames'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import NmBorderCounter from '@/components/nm-border-counter'
import NmGridPattern from '@/components/nm-grid-pattern'
import Skus, { TplsProps } from '@/components/dapp/landing/skus'
import styles from './index.module.scss'

export interface Props {
  tpls?: TplsProps //对应模板、主题等结构体
  customClass?: string // 整体盒子自定义样式
  hoverAnimation?: string | boolean // 卡片动画效果，borderFlow、boxZoom等type，默认无
  onClick?: BoxProps['onClick']
  component?: BoxProps['component']
}

const Wrap: FC<Props & PropsWithChildren> = ({ tpls, customClass, hoverAnimation, component, onClick, children }) => {
  const { font, card = {} } = Skus[tpls?.style || 'S000']
  let card_hover = hoverAnimation || card?.hover
  let mouseX = useMotionValue(0)
  let mouseY = useMotionValue(0)

  function onMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  let maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`
  let maskStyle = { maskImage, WebkitMaskImage: maskImage }

  let cardHoverBox = () => {
    switch (card_hover) {
      // 悬浮光影
      case 'lighting':
        return (
          <Box className="pointer-events-none rounded-[inherit]">
            <motion.div
              className="opacity-0 group-hover:opacity-100 rounded-[inherit] absolute inset-0 bg-gradient-to-r from-zinc-900/40 to-zinc-100/80 transition duration-300"
              style={maskStyle}
            />
          </Box>
        )
        break
      // 网格光影
      case 'gridPattern':
        return (
          <Box className="pointer-events-none bg-white/2.5 rounded-[inherit] absolute top-0 left-0 size-full">
            <Box className="group-hover:opacity-50 rounded-[inherit] absolute inset-0 transition duration-300 [mask-image:linear-gradient(white,transparent)]">
              <NmGridPattern
                width={72}
                height={56}
                x="50%"
                y="-6"
                className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5"
                squares={[
                  [-1, 2],
                  [1, 3],
                ]}
              />
            </Box>
            <motion.div
              className={`opacity-0 group-hover:opacity-100 rounded-[inherit] transition duration-300 absolute inset-0 bg-gradient-to-r from-[#202D2E] to-[#303428]`}
              style={maskStyle}
            />
            <motion.div
              className="opacity-0  group-hover:opacity-100 rounded-[inherit] transition duration-300 absolute inset-0 mix-blend-overlay"
              style={maskStyle}
            >
              <NmGridPattern
                width={72}
                height={56}
                x="50%"
                y="-6"
                className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5"
                squares={[
                  [-1, 2],
                  [1, 3],
                ]}
              />
            </motion.div>
          </Box>
        )
        break
      // 色彩高饱和光影
      case 'hsv':
      case 'rainbow':
        return (
          <Box
            className={classNames(
              'opacity-0 group-hover:opacity-100 rounded-[inherit] absolute top-0 left-0 size-full transition duration-500 -z-1',
              styles[`card-effect-${card_hover}`]
            )}
          />
        )
        break

      // border流动线条
      case 'borderFlow':
        return (
          <NmBorderCounter
            customClass="opacity-0 group-hover:opacity-100 rounded-[inherit] absolute top-0 left-0 size-full transition duration-300"
            customStyle={{ '--border-bg': card?.['--border-bg'] }}
            color={card?.borderCounter}
          />
        )
        break
      default:
        break
    }
  }

  return (
    <Box
      component={component}
      className={classNames(
        'group relative hover:bg-[length:200%_auto] backdrop-blur-md hover:bg-right-center transition-all duration-500',
        font?.color,
        card?.bg,
        {
          [typeof card?.bordered === 'boolean' ? 'card-bordered' : card?.bordered]: card?.bordered,
          'shadow-2xl': card?.shadow,
          'hover:scale-105 duration-1000 transition-all': card_hover === 'boxZoom',
        },
        customClass
      )}
      onMouseMove={['lighting', 'gridPattern'].includes(card_hover) ? onMouseMove : () => {}}
      onClick={onClick}
    >
      {cardHoverBox()}
      {children}
    </Box>
  )
}

export default Wrap
