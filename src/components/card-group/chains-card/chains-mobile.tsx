import React, { FC, useEffect } from 'react'
import classNames from 'classnames'
import { Backdrop } from '@mui/material'
import { useStudioContext } from '@/components/context/studio'
import ChainsMenu from '@/components/card-group/chains-card/chains-menu'
import { useMobile, useTailWindFade } from '@/lib/hooks'

interface ChainsMobileProps {}

const leaveAnimate = 'scale-y-0 pointer-events-none opacity-0'
const enterAnimate = 'scale-y-100'

const ChainsMobile: FC<ChainsMobileProps> = () => {
  const { chainsExpand, setChainsExpand } = useStudioContext()
  const isMobile = useMobile()
  const { className, setOpen } = useTailWindFade({ open: true })

  useEffect(() => {
    setOpen(chainsExpand)
  }, [chainsExpand])

  return (
    isMobile &&
    chainsExpand && (
      <>
        <Backdrop
          open
          className="backdrop-blur-sm z-999 fixed"
          onClick={() => {
            setOpen(false)
            setTimeout(() => {
              setChainsExpand(false)
            }, 300)
          }}
        />
        <div
          className={classNames(
            'fixed bottom-0 left-0 w-full z-[1001]',
            isMobile && chainsExpand ? 'visible' : 'invisible'
          )}
        >
          <div
            className={classNames(
              ...className('relative max-sm:origin-bottom origin-top ease-scale-cub', leaveAnimate, enterAnimate)
            )}
          >
            <ChainsMenu setChainsExpand={setChainsExpand} chainsExpand={chainsExpand} />
          </div>
        </div>
      </>
    )
  )
}

export default ChainsMobile
