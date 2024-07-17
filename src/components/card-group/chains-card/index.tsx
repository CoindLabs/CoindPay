import React, { FC } from 'react'
import ChainsList from '@/components/card-group/chains-card/chains-list'
export interface ChainsCardProps {
  disables?: string[]
  chainsExpand: boolean
  onClose: (e: Event | React.SyntheticEvent) => void
  anchorEl: React.MutableRefObject<HTMLButtonElement>
  setChainsExpand: React.Dispatch<React.SetStateAction<boolean>>
}

const ChainsCard: FC<ChainsCardProps> = ({ anchorEl, disables, chainsExpand, onClose, setChainsExpand }) => {
  return (
    <ChainsList
      chainsExpand={chainsExpand}
      anchorEl={anchorEl}
      onClose={onClose}
      setChainsExpand={setChainsExpand}
      disables={disables}
    />
  )
}

export default ChainsCard
