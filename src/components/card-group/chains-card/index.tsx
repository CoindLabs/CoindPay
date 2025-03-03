import React, { FC } from 'react'
import ChainsList from '@/components/card-group/chains-card/chains-list'
export interface ChainsCardProps {
  walletChains?: string[]
  chainsExpand: boolean
  onClose: (e: Event | React.SyntheticEvent) => void
  anchorEl: React.MutableRefObject<HTMLButtonElement>
  setChainsExpand: React.Dispatch<React.SetStateAction<boolean>>
}

const ChainsCard: FC<ChainsCardProps> = ({ anchorEl, walletChains, chainsExpand, onClose, setChainsExpand }) => {
  return (
    <ChainsList
      chainsExpand={chainsExpand}
      anchorEl={anchorEl}
      onClose={onClose}
      setChainsExpand={setChainsExpand}
      walletChains={walletChains}
    />
  )
}

export default ChainsCard
