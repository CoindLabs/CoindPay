import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from 'classnames'
import dayjs from 'dayjs'
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid2,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import NmIcon from '@/components/nm-icon'
import NmTooltip from '@/components/nm-tooltip'
import NmSpinInfinity from '@/components/nm-spin/infinity'
import QrCode from '@/components/card-group/qr-code'
import StudioLayout from '@/components/layout/studio'
import { useSnackbar } from '@/components/context/snackbar'
import { getPaymentPayeeSvc } from '@/services/pay'
import { useLocation, useUserData } from '@/lib/hooks'
import { getActiveChain } from '@/lib/web3'

let payTypes = [
  {
    title: 'Payment Links',
    desc: 'Receive crypto payments for anything.',
    type: 'link',
    icon: 'payment_link',
    iconClass: 'bg-green-500',
    actionClass: 'border-green-500 text-green-500',
    cardClass: 'hover:border-green-500',
    path: 'link',
  },
  {
    title: 'Invoice',
    desc: 'Send crypto invoices to your customers or clients.',
    type: 'invoice',
    iconClass: 'bg-violet-500',
    actionClass: 'border-violet-500 text-violet-500',
    cardClass: 'hover:border-violet-500',
    path: 'invoice',
    disabled: true,
  },
  {
    title: 'Checkout',
    desc: 'Grow your online store and start selling with crypto.',
    type: 'checkout',
    iconClass: 'bg-rose-500',
    actionClass: 'border-rose-500 text-rose-500',
    cardClass: 'hover:border-rose-500',
    path: 'checkout',
    disabled: true,
  },
]

export default function Pay() {
  const router = useRouter()

  const theme = useTheme()

  const lgScreen = theme.breakpoints.up('lg')

  const user = useUserData()

  const origin = useLocation('origin')

  const { showSnackbar } = useSnackbar()

  const [payeeData, setPayeeData] = useState([])
  const [payeeInitLoading, setPayeeInitLoading] = useState(true)

  const [payeeStatusLoading, setPayeeStatusLoading] = useState(Object)

  const handlePayeeLinkCopy = val => {
    navigator.clipboard.writeText(`${origin}/${val}`)
    showSnackbar({
      snackbar: {
        open: true,
        type: 'success',
        text: 'Payments link copy success ᵔ◡ᵔ',
      },
    })
  }

  const handleTableItemAction = async (item, type) => {
    setPayeeStatusLoading({
      [type]: true,
    })
    let query =
      (type == 'republish' && { status: 1 }) ||
      (type == 'disable' && { status: -1 }) ||
      (type == 'delete' && { status: 0 })
    let res = await getPaymentPayeeSvc({ ...item, ...query }, type == 'delete' ? 'delete' : 'put')
    if (res?.ok) {
      getPaymentPayee()
    }
    showSnackbar({
      snackbar: {
        open: true,
        type: res?.ok ? 'success' : 'error',
        text: res?.ok ? `Payment ${type} success ᵔ◡ᵔ` : res?.message || 'Server error ˙◠˙',
      },
    })
    setPayeeStatusLoading({
      [type]: false,
    })
  }

  const getPaymentPayee = async () => {
    try {
      let res = await getPaymentPayeeSvc({
        uuid: user?.id,
      })
      if (res?.ok && res?.data) {
        setPayeeData(res?.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setPayeeInitLoading(false)
  }

  useEffect(() => {
    if (!user?.id) return setPayeeInitLoading(false)
    getPaymentPayee()
  }, [user?.id])

  const StatusContent = ({ status }) => {
    let color, text
    switch (status) {
      case -1:
        color = 'rose'
        text = 'Disabled'
        break
      case 1:
      default:
        color = 'green'
        text = 'Running'
        break
    }
    return (
      <ul className="flex justify-center items-center gap-2">
        <li className="relative flex size-3 tooltip" data-tip={text}>
          <span
            className={classNames(
              `animate-ping absolute inline-flex size-full rounded-full bg-${color}-400 opacity-75`
            )}
          />
          <span className={`relative inline-flex rounded-full size-3 bg-${color}-500`} />
        </li>
      </ul>
    )
  }

  return (
    <StudioLayout>
      <header>
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {payTypes.map((row, index) => (
            <Link key={`pay-type-${index}`} href={!row?.disabled ? `/pay/${row?.path}` : ''}>
              <Card
                component="li"
                className={classNames(
                  'rounded-xl border border-neutral-100/50 shadow-sm p-4 py-6 transition-all',
                  row?.cardClass
                )}
              >
                <ul className="flex items-start gap-4">
                  <li>
                    <Avatar
                      className={classNames(
                        'rounded-lg hover:bg-create-gradient-004 hover:transition-all',
                        row?.iconClass
                      )}
                    >
                      <NmIcon type={`icon-${row?.icon || row?.type}`} />
                    </Avatar>
                  </li>
                  <li>
                    <h1 className="text-2xl -mt-1 align-center font-semibold truncate">{row?.title}</h1>
                    <p className="pt-2 opacity-50 line-clamp-2">{row?.desc}</p>
                  </li>
                </ul>
                <Box className="pt-8 text-right">
                  <NmTooltip title={row?.disabled ? 'Upcoming' : ''}>
                    <Button
                      variant="outlined"
                      className={classNames(
                        'w-28 h-10 rounded-md bg-transparent hover:text-white hover:bg-create-gradient-004 hover:border-0',
                        {
                          'cursor-not-allowed': row?.disabled,
                        },
                        row?.actionClass
                      )}
                      startIcon={<NmIcon type="icon-plus" />}
                    >
                      Create
                    </Button>
                  </NmTooltip>
                </Box>
              </Card>
            </Link>
          ))}
        </ul>
      </header>
      <section className="pt-8">
        {payeeInitLoading ? (
          <Box className="mt-24 flex justify-center">
            <NmSpinInfinity absoluteXCenter customClass="loading-lg scale-150" />
          </Box>
        ) : payeeData?.length > 0 ? (
          <TableContainer component={Paper} className="shadow-none overflow-y-hidden bg-transparent min-h-60">
            <Table className="w-full">
              <TableHead>
                <TableRow className="bg-create-gradient-004">
                  {[
                    {
                      name: 'Title',
                    },
                    {
                      name: 'Price',
                    },
                    {
                      name: 'Networks',
                      align: 'center',
                    },
                    {
                      name: 'Updated',
                    },
                    {
                      name: 'Status',
                      align: 'center',
                    },
                    {
                      name: '',
                    },
                  ].map((item, index) => (
                    <TableCell
                      key={`table-item-head-${index}`}
                      // @ts-ignore
                      align={item?.align || 'inherit'}
                      className="font-semibold text-white"
                    >
                      {item.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {payeeData?.map((row, index) => (
                  <TableRow key={`table-item-body-${index}`} className="group">
                    <TableCell className="font-semibold text-base truncate max-w-72 2xl:max-w-96">
                      <Grid2 container alignItems="center" className="gap-2">
                        <NmTooltip
                          title={
                            <QrCode
                              path={`pay/link/${row?.id}`}
                              customClass="p-1 cursor-pointer"
                              qrClass="!block"
                              propsId={`payment-link-qrcode-${index}`}
                            />
                          }
                          color="white"
                        >
                          <NmIcon
                            type="icon-qrcode"
                            className="cursor-pointer leading-0"
                            onClick={() => handlePayeeLinkCopy(`pay/link/${row?.id}`)}
                          />
                        </NmTooltip>
                        <Link
                          href={`/pay/link/${row?.id}`}
                          target="_blank"
                          className="hover:bg-clip-text hover:text-transparent hover:bg-create-gradient-004 hover:transition-all"
                          onClick={() => handlePayeeLinkCopy(`pay/link/${row?.id}`)}
                        >
                          {row?.title}
                        </Link>
                      </Grid2>
                    </TableCell>
                    <TableCell>
                      {row?.amountType != 2 ? (
                        row?.price > 0 ? (
                          <span className="font-semibold">{`$ ${row.price}`}</span>
                        ) : (
                          <Chip label="Free" size="small" color="secondary" className="scale-95" />
                        )
                      ) : (
                        <Chip label="Random" size="small" color="success" variant="outlined" className="scale-95" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={4}>
                        <AvatarGroup
                          max={lgScreen ? 5 : 3}
                          spacing="small"
                          className="justify-center scale-85"
                          total={row?.chains?.length}
                          renderSurplus={surplus => (
                            <NmTooltip
                              title={
                                <ul className="p-1 py-2 flex justify-center flex-wrap gap-2">
                                  {row?.chains.map((cc, cIndex) => (
                                    <li key={`table-item-body2-chain-${cIndex}`}>
                                      <Avatar
                                        alt=""
                                        className="size-8"
                                        src={getActiveChain({ name: cc?.name })?.icon}
                                      />
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
                    </TableCell>
                    <TableCell>{dayjs(row?.updatedAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                    <TableCell align="center">
                      <StatusContent status={row.status} />
                    </TableCell>
                    <TableCell>
                      <ul className="flex justify-end gap-2">
                        <li>
                          <Link href={`/pay/link/form/${row?.id}`}>
                            <Button size="small" variant="outlined" color="inherit" className="shadow-sm rounded-md">
                              Edit
                            </Button>
                          </Link>
                        </li>
                        <li className="dropdown dropdown-left group-last:dropdown-top">
                          <Button
                            tabIndex={5}
                            size="small"
                            variant="contained"
                            className="shadow-sm rounded-md bg-create-gradient-004"
                          >
                            More
                          </Button>
                          <ul tabIndex={5} className="dropdown-content menu bg-base-100 rounded-md z-1 w-52 p-2 shadow">
                            {row?.status == -1 ? (
                              <li
                                className="leading-8 hover:bg-black hover:text-theme-success transition-all rounded-md"
                                onClick={() => handleTableItemAction(row, 'republish')}
                              >
                                <a
                                  className={classNames('flex items-center justify-between', {
                                    'cursor-not-allowed': payeeStatusLoading?.republish,
                                  })}
                                >
                                  {payeeStatusLoading?.republish ? (
                                    <NmIcon type="icon-spin" className="animate-spin text-xl leading-0" />
                                  ) : (
                                    <NmIcon type="icon-publish" className="text-xl leading-0" />
                                  )}

                                  <span>Republish</span>
                                </a>
                              </li>
                            ) : (
                              <li
                                className="leading-8 hover:bg-black hover:text-theme-warning transition-all rounded-md"
                                onClick={() => handleTableItemAction(row, 'disable')}
                              >
                                <a
                                  className={classNames('flex items-center justify-between', {
                                    'cursor-not-allowed': payeeStatusLoading?.disable,
                                  })}
                                >
                                  {payeeStatusLoading?.disable ? (
                                    <NmIcon type="icon-spin" className="animate-spin text-xl leading-0" />
                                  ) : (
                                    <NmIcon type="icon-disabled" className="text-xl leading-0" />
                                  )}
                                  <span>Disable</span>
                                </a>
                              </li>
                            )}

                            <Divider className="border-dashed group-hover:opacity-0 my-1" />

                            <li
                              className="leading-8 hover:bg-black hover:text-theme-error transition-all rounded-md"
                              onClick={() => handleTableItemAction(row, 'delete')}
                            >
                              <a
                                className={classNames('flex items-center justify-between', {
                                  'cursor-not-allowed': payeeStatusLoading?.delete,
                                })}
                              >
                                {payeeStatusLoading?.delete ? (
                                  <NmIcon type="icon-spin" className="animate-spin text-xl leading-0" />
                                ) : (
                                  <NmIcon type="icon-delete" className="text-xl leading-0" />
                                )}
                                <span>Delete</span>
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box className="flex flex-col gap-12 items-center pt-12">
            <DotLottieReact
              src="https://cdn.prod.website-files.com/6697d9640762e667851a7de8/66a8fe66f49af6112730e3c8_checkout-coins.json"
              loop
              autoplay
              className="xl:w-2/3"
            />
            <Button
              size="large"
              variant="contained"
              className="px-8 py-3.5 text-lg shadow-none rounded-lg bg-create-gradient-004"
              endIcon={<NmIcon type="icon-publish" />}
              onClick={() => router.push('/pay/link')}
            >
              Create your Payments
            </Button>
          </Box>
        )}
      </section>
    </StudioLayout>
  )
}
