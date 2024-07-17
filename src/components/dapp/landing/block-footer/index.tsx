import { memo } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { Link } from '@mui/material'
import BlockLink from '@/components/dapp/landing/block-link'
import Skus from '@/components/dapp/landing/skus'

import config from '@/config'

const { logo } = config

const BlockFooter = ({ className = '', tpls, link = '', inviteCode = '' }) => {
  const router = useRouter()
  const { font, footer } = Skus[tpls?.style || 'S000']

  return (
    <footer className={`pt-36 pb-4 text-center ${className}`}>
      <h2 className="font-light">
        <span className={classNames('opacity-30', font?.color)}>Build with</span>
        <Link
          underline="none"
          className="ml-1.5 text-lg font-satisfy text-transparent bg-clip-text bg-theconvo-gradient-001 bg-cover transition-all duration-500"
          href="//x.com/CoindPay"
          target="_blank"
        >
          {config.title}
        </Link>
      </h2>
      <p className="mb-12">
        <Link
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={classNames('text-white decoration-white underline-offset-4 font-medium', {
            [footer?.color]: tpls?.backdrop?.type === 'B000' && tpls?.style === 'S001',
            '!decoration-black': tpls?.backdrop?.type === 'B000' && tpls?.style === 'S001',
          })}
          href={inviteCode ? link + '?from=' + inviteCode : link}
        >
          Create your own!
        </Link>
      </p>
      <BlockLink
        tpls={tpls}
        href={inviteCode ? '/?from=' + inviteCode : '/'}
        text={`${config.host} / username`}
        avatarClass="rounded-none"
        nameClass="!pr-0 opacity-50"
        customClass="w-72 sm:w-80 pl-4 !rounded-full animate__animated animate__pulse animate__infinite animate__slower"
        imgSrc={logo.light}
      />
    </footer>
  )
}

export default memo(BlockFooter)
