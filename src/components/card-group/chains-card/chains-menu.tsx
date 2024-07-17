import React, { FC } from 'react'
import Image from 'next/image'
import classNames from 'classnames'
import { MenuList, MenuItem } from '@mui/material'
import { useConnectModal, useAccountModal } from '@rainbow-me/rainbowkit'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useEVMWalletConnect } from '@/lib/hooks'

import config from '@/config'

const { domains, title } = config

export const Rows = [
  {
    images: ['coinbase.svg', 'grow.png', 'phantom.svg'],
    type: 'Solana',
  },
  {
    images: ['rainbow.svg', 'walletconnect.svg', 'metamask.svg'],
    type: 'EVM',
  },
  {
    images: ['unisat.svg', 'xverse.svg', 'btc.svg'],
    type: 'BTC',
    disabled: true,
  },
  {
    images: ['bitfinity.webp', 'plug.svg', 'icp.svg'],
    type: 'ICP',
    disabled: true,
  },
  {
    images: ['tonkeeper.svg', 'openmask.svg', 'ton.svg'],
    type: 'TON',
    disabled: true,
  },
]

interface ChainsMenuProps {
  chainsExpand: boolean
  disables?: string[] // custom configs
  setChainsExpand: React.Dispatch<React.SetStateAction<boolean>>
  onClose?: (e: Event | React.SyntheticEvent) => void
}

const ChainsMenu: FC<ChainsMenuProps> = ({ chainsExpand, disables = [], setChainsExpand, onClose, ...props }) => {
  const evmWalletConnect = useEVMWalletConnect()
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { setVisible } = useWalletModal()
  const handleClick = (type: string) => {
    switch (type) {
      case 'EVM':
        evmWalletConnect ? openAccountModal() : openConnectModal()
        break
      case 'Solana':
        setVisible(true)
        break
      default:
        break
    }
    setChainsExpand(false)
  }

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setChainsExpand(false)
    } else if (event.key === 'Escape') {
      setChainsExpand(false)
    }
  }

  return (
    <MenuList
      autoFocusItem={chainsExpand}
      id="composition-menu"
      aria-labelledby="composition-button"
      onKeyDown={handleListKeyDown}
      className="mt-0.5 sm:border sm:border-gray-100 py-3 menu z-100 bg-white shadow-sm rounded-t-3xl sm:rounded-xl w-screen sm:w-fit sm:min-w-64"
    >
      <h2 className="pt-6 pb-10 font-righteous text-center text-2.5xl sm:hidden">{`Connect to ${title}`}</h2>
      {Rows.map((row, i) => (
        <MenuItem
          key={i}
          className={classNames('p-0 my-1.5 sm:my-0.5 flex items-center flex-row w-full', {
            'cursor-not-allowed': disables?.includes(row?.type) || row?.disabled,
          })}
          onClick={() => handleClick(row.type)}
          disabled={disables?.includes(row?.type) || row?.disabled}
        >
          <div className="flex items-center relative w-full">
            <div className="-space-x-2 flex hover:scale-105 transition-all">
              {row.images.map((image, v) => (
                <Image
                  key={`${i}-${v}`}
                  alt=""
                  width="40"
                  height="40"
                  src={`${domains.cdn}/static/social/${image}`}
                  className="size-10 xl:w-9 xl:h-9 p-0.5 rounded-full bg-white"
                />
              ))}
            </div>
            <h2 className="text-lg font-semibold pl-2">{row.type}</h2>
          </div>
        </MenuItem>
      ))}
    </MenuList>
  )
}

export default ChainsMenu
