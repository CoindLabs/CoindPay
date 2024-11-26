import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Box, Stack, AvatarGroup, Avatar, useTheme } from '@mui/material'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import classNames from 'classnames'
import NmIcon from '@/components/nm-icon'
import NmTooltip from '@/components/nm-tooltip'
import { getActiveChain } from '@/lib/web3'

import config from '@/config'

const { images } = config

const PaymentBio = ({ payee = null, user = null, classes = null } = {}) => {
  const router = useRouter()
  const theme = useTheme()
  const lgScreen = theme.breakpoints.up('lg')

  return (
    <li className={classNames('flex flex-wrap gap-8', classes)}>
      {payee?.length ? (
        payee.map((row, index) => (
          <li key={`payee-item-${index}`} className="flex-1">
            <div className="card min-w-72 2xl:min-w-80 bg-base-100 image-full shadow-lg">
              <figure className="sm:h-64">
                <img
                  src={row?.images?.[0]?.url || images.banner.cover}
                  alt={row?.title}
                  className="w-full object-cover"
                />
              </figure>
              <Link className="card-body z-10 p-4" href={`pay/link/${row?.id}`} target="_blank">
                <h2 className="text-2xl card-title line-clamp-2">{row?.title}</h2>
                <p className="line-clamp-3 whitespace-pre-wrap text-neutral-400">{row?.desc}</p>
                <Box className="card-actions flex-nowrap items-center justify-between">
                  <Stack spacing={4}>
                    <AvatarGroup
                      max={lgScreen ? 5 : 3}
                      spacing="small"
                      className="justify-center scale-70 2xl:scale-75 3xl:scale-80"
                      total={row?.chains?.length}
                      renderSurplus={surplus => (
                        <NmTooltip
                          title={
                            <ul className="p-1 py-2 flex justify-center flex-wrap gap-2">
                              {row?.chains.map((cc, cIndex) => (
                                <li key={`table-item-body2-chain-${cIndex}`}>
                                  <Avatar alt="" className="size-8" src={getActiveChain({ name: cc?.name })?.icon} />
                                </li>
                              ))}
                            </ul>
                          }
                        >
                          <span className="cursor-pointer">+{surplus}</span>
                        </NmTooltip>
                      )}
                    >
                      {row?.chains.map((cc, cIndex) => (
                        <NmTooltip title={cc?.name} key={`table-item-body1-chain-${cIndex}`}>
                          <Avatar
                            alt=""
                            src={getActiveChain({ name: cc?.name })?.icon}
                            className={classNames({
                              'bg-black': cc?.name
                                .split(' ')
                                .some(word => ['SOON', 'Arbitrum', 'BSC', 'Polygon', 'Aurora'].includes(word)),
                            })}
                          />
                        </NmTooltip>
                      ))}
                    </AvatarGroup>
                  </Stack>
                  <button className="btn btn-sm btn-secondary">Buy Now</button>
                </Box>
              </Link>
            </div>
          </li>
        ))
      ) : (
        <Box className="flex flex-col gap-12 items-center pt-12">
          <DotLottieReact
            src="https://cdn.prod.website-files.com/6697d9640762e667851a7de8/66a8fe66f49af6112730e3c8_checkout-coins.json"
            loop
            autoplay
          />
          <Button
            size="large"
            variant="contained"
            className="px-8 py-3.5 text-lg shadow-none rounded-lg bg-create-gradient-004"
            endIcon={<NmIcon type="icon-publish" />}
            onClick={() => router.push('/pay/link')}
          >
            Start your Payments
          </Button>
        </Box>
      )}
    </li>
  )
}

export default PaymentBio
