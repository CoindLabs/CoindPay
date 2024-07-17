import { memo, useState, useRef, useEffect } from 'react'
import { Box } from '@mui/material'
import classNames from 'classnames'
import Skus from '@/components/dapp/landing/skus'
import LandingCard from '../base/card'

const BlockText = ({ tpls, blockData, ...props }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef(null)
  const { title, data, id: blockId } = blockData || {}
  const { text, font } = Skus[tpls?.style || 'S000']
  const { radius = 'rounded-lg' } = text || {}
  const { name } = data

  useEffect(() => {
    if (textRef.current) {
      const isOver = textRef.current.scrollHeight > textRef.current.clientHeight
      setIsOverflowing(isOver)
    }
  }, [blockData])

  const handleToggleExpand = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsExpanded(prevState => !prevState)
  }

  if (!name) return null

  return (
    <LandingCard
      tpls={tpls}
      title={title}
      customClass={classNames('group', radius)}
      headerClass="!mb-2"
      blockId={blockId}
    >
      <Box
        ref={textRef}
        className={classNames(
          'text-base whitespace-pre-wrap leading-6 opacity-50 break-words relative',
          font?.color,
          !isExpanded && 'line-clamp-30'
        )}
        onDoubleClick={handleToggleExpand}
      >
        {name}
      </Box>
      {isOverflowing && (
        <span onClick={handleToggleExpand} className={classNames('text-sm opacity-90 cursor-pointer', font?.color)}>
          {isExpanded ? ' Show less' : ' Show more'}
        </span>
      )}
    </LandingCard>
  )
}

export default memo(BlockText)
