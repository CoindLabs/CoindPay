import React from 'react'
import Image from 'next/image'
import { Box } from '@mui/material'
import { QRCodeCanvas } from 'qrcode.react'
import classNames from 'classnames'
import { useLocation } from '@/lib/hooks'
import { env } from '@/lib/types/env'

import config from '@/config'

const { domains } = config

export default function QrCode({
  customClass = null,
  qrClass = null,
  imageConfig = null,
  size = 120,
  bgColor = '#fff',
  fgColor = '#000',
  url = '',
  path = '',
  propsId = 'QrCode',
  ...props
}) {
  if (!(path || url)) return
  const origin = useLocation('origin')

  let domain = env?.isDev ? domains.dev : origin

  return (
    <Box className={classNames('size-fit', customClass)} onClick={props?.onQrClick}>
      <QRCodeCanvas
        id={propsId}
        className={classNames('hidden', qrClass)}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        value={url || (path && `${domain}/${path}`)}
      />
      {imageConfig?.src && (
        <Box
          className="p-1 rounded-lg bg-white absolute"
          style={{
            top: (size - imageConfig?.height) / 2,
            left: (size - imageConfig?.width) / 2,
            width: imageConfig?.width,
            height: imageConfig?.height,
          }}
        >
          <Image
            src={imageConfig?.src}
            width={imageConfig?.width}
            height={imageConfig?.height}
            className="size-full rounded-lg"
            alt=""
          />
        </Box>
      )}
    </Box>
  )
}
