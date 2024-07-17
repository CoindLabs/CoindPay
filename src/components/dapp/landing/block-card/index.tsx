import { useCallback, memo, useEffect, useState } from 'react'
import classNames from 'classnames'
import LandingCard from '../base/card'
import { Box, IconButton, Link } from '@mui/material'
import Skus from '@/components/dapp/landing/skus'
import NmEmbed from '@/components/nm-embed'
import NmIcon from '@/components/nm-icon'
import NmTooltip from '@/components/nm-tooltip'
import CropImg from '@/components/nm-crop/crop-img'
import { NmImage } from '@/components/nm-image'
import styles from './index.module.scss'

const BlockCard = ({ tpls, blockData, flexDirection = 'flex-col', ...props }) => {
  const { title, data, id: blockId } = blockData || {}
  const { font } = Skus[tpls?.style || 'S000']
  const { url, name, description } = data
  let image = data?.image?.url || data?.image

  const coverLink = () =>
    url && (
      <Link href={url} target="_blank" underline="none" rel="noopener noreferrer nofollow">
        <NmTooltip title="Full">
          <IconButton size="small" className="size-8">
            <NmIcon type="icon-fullscreen" className={classNames('opacity-70 transition-all', font?.color)} />
          </IconButton>
        </NmTooltip>
      </Link>
    )

  const boxRender = useCallback(data => {
    if (data) {
      if (data?.preview_url && data?.fetch == 'screenshot') {
        return (
          <Box className="overflow-hidden relative flex justify-center items-center">
            <NmImage
              url={data.preview_url}
              className="absolute"
              isCenter={true}
              path={typeof data.preview_path === 'string' ? JSON.parse(data.preview_path) : data.preview_path}
            />
          </Box>
        )
      } else if (data?.html && data?.fetch === 'iframely') {
        return <div dangerouslySetInnerHTML={{ __html: data?.html }} className={classNames(styles.card)} />
      } else {
        return <NmEmbed url={data?.url} />
      }
    }
  }, [])

  return (
    <LandingCard tpls={tpls} title={title} titleExtra={coverLink()} blockId={blockId}>
      <Link
        underline="none"
        target="_blank"
        className={`flex ${flexDirection} decoration-transparent`}
        href={url || undefined}
        rel="noopener noreferrer nofollow"
      >
        {image ? (
          <Box
            className={classNames(
              'w-full h-52 max-md:h-64 lg:h-72 xl:h-80 relative self-center overflow-hidden rounded-xl',
              {
                'flex-[0_1_30%]': flexDirection === 'flex-row',
              }
            )}
          >
            <CropImg
              src={image}
              imgStyle={data?.image?.imgStyle}
              customClass="hover:scale-125 transition-all duration-1000"
              imgClassName="object-cover"
            />
          </Box>
        ) : (
          boxRender(data)
        )}
        {(name || description) && (
          <Box className="mt-2">
            {name && <h2 className={classNames('font-medium text-white truncate', font?.color)}>{name}</h2>}
            {description && <p className={classNames('text-sm line-clamp-2 opacity-50', font?.color)}>{description}</p>}
          </Box>
        )}
      </Link>
    </LandingCard>
  )
}

export default memo(BlockCard)
