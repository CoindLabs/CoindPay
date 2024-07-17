import React, { useRef } from 'react'
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion'

export const ContainerScroll = ({
  titleComponent,
  children,
  ...props
}: {
  headerClass: string | null
  titleComponent: string | React.ReactNode
  children: React.ReactNode
}) => {
  const containerRef = useRef<any>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1])
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <div className="flex items-center justify-center relative" ref={containerRef}>
      <div
        className="w-full relative"
        style={{
          perspective: '1000px',
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} headerClass={props?.headerClass} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  )
}

export const Header = ({ translate, titleComponent, headerClass }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className={headerClass}
    >
      {titleComponent}
    </motion.div>
  )
}

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  translate: MotionValue<number>
  children: React.ReactNode
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
      }}
    >
      <div className="size-full overflow-hidden dark:bg-zinc-900">{children}</div>
    </motion.div>
  )
}
