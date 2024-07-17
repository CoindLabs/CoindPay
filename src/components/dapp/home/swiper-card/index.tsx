import { Box, Link } from '@mui/material'
import Image from 'next/image'
import classNames from 'classnames'
import randomcolor from 'randomcolor'
import { getBlurDataURL } from '@/lib/utils'
import styles from './index.module.scss'

import config from '@/config'

const { images } = config

const KolSwipe = ({ data }) => {
  return (
    <Box className={classNames(styles['card'])}>
      <ul className={classNames('flex', styles['card__inner'])}>
        <li className="relative flex-1 w-full h-56 sm:h-80">
          <Image
            fill
            alt=""
            className={classNames(
              'object-cover absolute top-0 left-0',
              `${data['radius'] || 'rounded-3xl'}`,
              styles['card__front']
            )}
            unoptimized
            src={data?.avatar}
            placeholder="blur"
            blurDataURL={getBlurDataURL(300, 300)}
            onError={e => {
              e.currentTarget.onerror = null
              e.target['src'] = images.placeholder
            }}
          />
        </li>
        <li
          className={classNames(
            'absolute top-0 left-0 flex justify-center items-center bg-white size-full text-slate-700',
            `${data['radius'] || 'rounded-3xl'}`,
            {
              'cursor-not-allowed': !data?.path,
            },
            styles['card__back']
          )}
          style={{
            background: data.bg || randomcolor(),
          }}
        >
          <Link
            className={classNames('py-3 px-5 text-black text-sm md:text-base md:px-10 rounded-full bg-white', {
              'hover:scale-110 duration-500 transition-all shadow': data?.path,
            })}
            underline="none"
            href={data?.path || undefined}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            {data?.name || data?.path}
          </Link>
        </li>
      </ul>
    </Box>
  )
}
export default KolSwipe
