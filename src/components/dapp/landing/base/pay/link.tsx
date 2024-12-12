import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useDebounceFn, useThrottleFn } from 'ahooks'
import classNames from 'classnames'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from '@mui/material'
import NmIcon from '@/components/nm-icon'
import NmTooltip from '@/components/nm-tooltip'
import NmBorderCounter from '@/components/nm-border-counter'
import LandingCard from '@/components/dapp/landing/base/card'
import { useSnackbar } from '@/components/context/snackbar'
import { useStudioContext } from '@/components/context/studio'
import NmPondUpload from '@/components/nm-upload'
import PaymentLanding from './landing'
import { useGlobalWalletConnect, useLocation, useUserData } from '@/lib/hooks'
import { _payChains, payChains } from '@/lib/chains'
import { getActiveChain } from '@/lib/web3'
import { getIncludesIgnoreCase } from '@/lib/utils'
import { getPaymentPayeeSvc } from '@/services/pay'

let paymentSteps = [
    {
      name: 'Product Details',
    },
    {
      name: 'Payment Options',
    },
    {
      name: 'Widget Design',
    },
  ],
  paymentAmountTypes = {
    1: {
      name: 'Fixed Price',
    },
    2: {
      name: 'Random Tips',
    },
  },
  defaultMaxPrice = 100000,
  defaultMaxAmount = 1000000

export default function PaymentLink({ ...props }) {
  const { data } = props
  const router = useRouter()
  const origin = useLocation('origin'),
    preview_url = `${origin}/pay/link/${data?.id}`

  const [paymentForm, setPaymentForm] = useState(
    data || {
      title: '',
      desc: '',
      price: 5,
      chains: payChains
        .filter(row => row.type == 'SVM')
        ?.map(item => {
          return item?.['chainId'] ? { id: item?.['chainId'], name: item?.name } : { name: item?.name }
        }),
      theme: 0,
      copyright: true,
    }
  )

  const user = useUserData()
  const globalWalletConnect = useGlobalWalletConnect()

  const { showSnackbar } = useSnackbar()
  const { setAccountCardShow } = useStudioContext()

  const [submitLoading, setSubmitLoading] = useState(false)

  const [chainsTab, setChainsTab] = useState(0)

  const [paymentFormTips, setPaymentFormTips] = useState(Object || null)

  const [paymentStep, setPaymentStep] = useState(data?.id ? [0, 1, 2] : Array)

  const [accordionActive, setAccordionActive] = useState<number | false>(0)

  const handlePayeeLinkCopy = () => {
    navigator.clipboard.writeText(preview_url)
    showSnackbar({
      snackbar: {
        open: true,
        type: 'success',
        text: 'Payments link copy success ᵔ◡ᵔ',
      },
    })
  }

  const { run: handlePaymentForm } = useThrottleFn(
    (key, value, index = 0) => {
      let newValue

      if (['maxAmount', 'price'].includes(key)) {
        if ((key == 'maxAmount' && value <= defaultMaxAmount) || (key == 'price' && value <= defaultMaxPrice)) {
          newValue = {
            [key]: Number(value),
          }
        }
      } else {
        newValue = {
          [key]: value,
        }
      }

      setPaymentForm(prev => ({ ...prev, ...newValue }))

      if (paymentFormTips[key]) {
        delete paymentFormTips[key]
        setPaymentFormTips(paymentFormTips)
      }
      if (
        (['price', 'maxAmount'].includes(key)
          ? value > ((key == 'price' && defaultMaxPrice) || (key == 'maxAmount' && defaultMaxAmount))
          : !value) &&
        ['title', 'price', 'maxAmount'].includes(key)
      ) {
        setPaymentStep(paymentStep.filter(row => row !== index))
      }
    },
    { wait: 50 }
  )

  const handlePaymentFirst = (key = 'title') => {
    if (paymentForm[key]) {
      if (paymentFormTips[key]) {
        delete paymentFormTips[key]
        setPaymentFormTips(paymentFormTips)
      }
      setPaymentStep([0, ...paymentStep])
      setAccordionActive(1)
    } else {
      setPaymentFormTips({
        ...paymentFormTips,
        [key]: true,
      })
    }
  }

  const handlePaymentSecond = (keys = ['price', 'maxAmount', 'chains']) => {
    if (
      (paymentForm?.amountType == 2
        ? !paymentForm?.maxAmount || (paymentForm?.maxAmount >= 0 && paymentForm?.maxAmount <= defaultMaxAmount)
        : paymentForm?.price >= 0 && paymentForm?.price <= defaultMaxPrice) &&
      paymentForm?.chains?.length
    ) {
      for (let row of keys) {
        if (paymentFormTips[row]) {
          delete paymentFormTips[row]
        }
      }
      setPaymentFormTips(paymentFormTips)

      setPaymentStep([...paymentStep, 1])
      setAccordionActive(2)
    } else {
      let tips = {}
      if (paymentForm?.price > defaultMaxPrice) tips['price'] = true
      if (paymentForm?.maxAmount > defaultMaxAmount) tips['maxAmount'] = true
      if (!paymentForm?.chains?.length) tips['chains'] = true

      setPaymentFormTips({
        ...paymentFormTips,
        ...tips,
      })

      if (paymentStep?.includes(1)) {
        setPaymentStep(paymentStep.filter(row => row != 1))
      }
    }
  }

  const handlePaymentPublish = async () => {
    if (paymentStep.includes(0) && paymentStep.includes(1) && !Object.keys(paymentFormTips)?.length) {
      if (!globalWalletConnect || !user?.id) return setAccountCardShow(true)
      setSubmitLoading(true)

      let res = await getPaymentPayeeSvc({ ...paymentForm, uuid: user?.id }, 'post')
      if (res?.ok && res?.data) {
        setTimeout(_ => {
          router.push('/pay')
        }, 350)
      }
      showSnackbar({
        snackbar: {
          open: true,
          type: res?.ok ? 'success' : 'error',
          text: res?.ok ? `Payment ${data?.id ? 'update' : 'create'} success ᵔ◡ᵔ` : res?.message || 'Server error ˙◠˙',
        },
      })
      setSubmitLoading(false)
    }
  }

  const handleChainsSelect = item => {
    setPaymentForm(prev => {
      const preChains = [...prev?.chains]

      const selectedIndex = preChains.findIndex(
        row => getIncludesIgnoreCase(item?.name, row?.name) && item?.chainId === row?.id
      )

      if (selectedIndex == -1) {
        preChains.push({
          name: item.name,
          id: item?.chainId,
        })
      } else {
        if (prev?.chains?.length == 1) {
          showSnackbar({
            snackbar: {
              open: true,
              type: 'warning',
              text: 'Please select at least one chain ˙◠˙',
            },
          })
          return prev
        }
        preChains.splice(selectedIndex, 1)
      }

      return { ...prev, chains: preChains }
    })
  }

  const handleAccordionChange = (panel: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setAccordionActive(newExpanded ? panel : false)
    if (!newExpanded) {
      switch (panel) {
        case 0:
          handlePaymentFirst()
          break
        case 1:
          handlePaymentSecond()

        default:
          break
      }
    }
  }

  const AccordionDetailsContent = index => {
    switch (index) {
      case 0:
        return (
          <ul>
            <li>
              <Grid2 container className="pb-2">
                <h2 className="font-medium">Title</h2>
                {paymentFormTips?.title && <span className="pl-1 text-theme-error">is required *</span>}
              </Grid2>
              <input
                type="text"
                maxLength={256}
                className={classNames(
                  'py-3 w-full truncate rounded-md  focus:border-neutral-500 focus:bg-transparent focus:ring-0',
                  paymentFormTips?.title ? 'border-theme-error bg-transparent' : 'bg-neutral-100 border-transparent'
                )}
                placeholder="Name"
                value={paymentForm?.title}
                onChange={e => handlePaymentForm('title', e.target.value, index)}
              />
            </li>
            <li className="py-6">
              <Grid2 container justifyContent="space-between" alignItems="center" className="pb-2">
                <h2 className="font-medium">Description</h2>
                <span className="text-neutral-400 text-sm">Optional</span>
              </Grid2>
              <textarea
                maxLength={10240}
                className="resize-none whitespace-pre-wrap p-2 w-full min-h-32 rounded-md bg-neutral-100 border-transparent focus:border-neutral-500 focus:bg-transparent focus:ring-0"
                placeholder="For more information"
                value={paymentForm?.desc}
                onChange={e => handlePaymentForm('desc', e.target.value)}
              />
            </li>
            <li className="pb-6">
              <NmPondUpload
                itemInsertLocation="after"
                allowMultiple
                maxFiles={5}
                maxFileSize="5MB"
                acceptedFileTypes={['image/*']}
                maxParallelUploads={5}
                uploads={paymentForm?.images}
                onUploadSuccess={data => {
                  setPaymentForm(prev => ({
                    ...prev,
                    images: (paymentForm?.images || []).concat(data),
                  }))
                }}
                onRemoveFile={data => {
                  setPaymentForm(prev => ({
                    ...prev,
                    images: paymentForm?.images?.filter(file => file.name != data.name),
                  }))
                }}
                customClass={classNames({
                  'cursor-not-allowed': paymentForm?.images?.length >= 5,
                })}
              />
              {paymentForm?.images?.length > 0 && (
                <ul className={classNames('mt-6 w-full carousel bg-neutral-100 rounded-box space-x-2 p-4')}>
                  {paymentForm?.images.map((row, index) => (
                    <li
                      className={classNames('relative carousel-item w-fit h-auto min-w-0 max-h-32', {
                        'flex-1': data?.images?.length == 1,
                      })}
                      key={`carousel-item-${index}`}
                    >
                      <IconButton
                        size="small"
                        className="absolute right-1 top-0 bg-error"
                        onClick={() => {
                          let images = [...paymentForm?.images]
                          images.splice(index, 1)
                          setPaymentForm(prev => ({ ...prev, images }))
                        }}
                      >
                        <NmIcon type="icon-delete" className="text-white scale-90" />
                      </IconButton>
                      <Image
                        src={row.url}
                        alt=""
                        width={128}
                        height={128}
                        draggable={false}
                        className={classNames('rounded-lg object-contain', {
                          'w-full': paymentForm?.images?.length == 1,
                        })}
                        onError={e => {}}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="flex justify-end">
              <Button
                size="large"
                variant="contained"
                color="inherit"
                className={classNames(
                  'shadow-sm rounded-md w-32 text-white',
                  paymentStep?.includes(0) ? 'bg-create-gradient-004' : 'bg-black'
                )}
                onClick={() => handlePaymentFirst('title')}
              >
                Next
              </Button>
            </li>
          </ul>
        )
        break
      case 1:
        return (
          <ul>
            <li className="flex items-end gap-4">
              <FormControl>
                <InputLabel id="payment-amount-type-label">Amount Type</InputLabel>
                <Select
                  labelId="payment-amount-type-label"
                  id="payment-amount-type"
                  label="Amount Type"
                  className="min-w-36 sm:min-w-40"
                  defaultValue={1}
                  value={paymentForm?.amountType || 1}
                  MenuProps={{
                    disableScrollLock: true,
                  }}
                  onChange={e => setPaymentForm({ ...paymentForm, amountType: Number(e.target.value) })}
                >
                  {Object.entries(paymentAmountTypes).map((row, index) => (
                    <MenuItem key={`payment-amount-type-${index}`} value={row[0]}>
                      {row[1].name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box className="flex-1">
                <Grid2
                  component="ul"
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  className="pb-2 flex-nowrap truncate"
                >
                  <li className="flex items-center">
                    <h2 className="font-medium">{paymentAmountTypes[paymentForm.amountType]?.name}</h2>
                    {paymentFormTips?.price && <span className="pl-1 text-theme-error">illegal *</span>}
                  </li>
                  <li>
                    <span className="text-neutral-400 text-sm">
                      0(Free) ~ {(paymentForm?.amountType == 2 && paymentForm?.maxAmount) || defaultMaxPrice}
                    </span>
                  </li>
                </Grid2>
                <Grid2 container justifyContent="space-between" alignItems="center" className="relative">
                  {paymentForm?.amountType != 2 ? (
                    <input
                      type="number"
                      min={0}
                      max={defaultMaxPrice}
                      className={classNames(
                        'flex-1 py-3.5 truncate rounded-md rounded-r-none focus:border-neutral-500 focus:bg-transparent focus:ring-0',
                        paymentFormTips?.price
                          ? 'border-theme-error bg-transparent'
                          : 'bg-neutral-100 border-transparent'
                      )}
                      placeholder="Price"
                      value={paymentForm?.price}
                      onChange={e => handlePaymentForm('price', e.target.value, index)}
                    />
                  ) : (
                    <Box className="flex-1 text-center py-3.5 rounded-md rounded-r-none bg-neutral-300 cursor-not-allowed">
                      ~
                    </Box>
                  )}
                  <Button
                    size="large"
                    variant="contained"
                    color="inherit"
                    className="py-3.5 shadow-none rounded-l-none bg-neutral-100"
                  >
                    USD
                  </Button>
                </Grid2>
              </Box>
            </li>
            {paymentForm?.amountType == 2 && (
              <li className="pt-6">
                <Grid2 component="ul" container justifyContent="space-between" alignItems="center" className="pb-2">
                  <li className="flex items-center">
                    <h2 className="font-medium">Maximum</h2>
                    {paymentFormTips?.maxAmount && <span className="pl-1 text-theme-error">is illegal *</span>}
                  </li>
                  <li>
                    <span className="text-neutral-400 text-sm">Optional</span>
                  </li>
                </Grid2>
                <Grid2 container justifyContent="space-between" alignItems="center" className="relative">
                  <input
                    type="number"
                    min={0}
                    max={defaultMaxAmount}
                    className={classNames(
                      'flex-1 py-3.5 truncate rounded-md rounded-r-none focus:border-neutral-500 focus:bg-transparent focus:ring-0',
                      paymentFormTips?.maxAmount
                        ? 'border-theme-error bg-transparent'
                        : 'bg-neutral-100 border-transparent'
                    )}
                    placeholder="Amount"
                    defaultValue={defaultMaxPrice}
                    value={paymentForm?.maxAmount}
                    onChange={e => handlePaymentForm('maxAmount', e.target.value, index)}
                  />
                  <Button
                    size="large"
                    variant="contained"
                    color="inherit"
                    className="py-3.5 shadow-none rounded-l-none bg-neutral-100"
                  >
                    USD
                  </Button>
                </Grid2>
              </li>
            )}
            <li className="py-6 pb-14">
              <Grid2 container>
                <h2 className="font-medium">Networks</h2>
                {paymentFormTips?.chains && <span className="pl-1 text-theme-error">is required *</span>}
              </Grid2>

              <Tabs
                className="py-4"
                value={chainsTab}
                onChange={(e, val) => setChainsTab(val)}
                aria-label="Switch Chain Tab"
              >
                {_payChains().map((row, index) => (
                  <Tab
                    key={`chain-tab-${index}`}
                    label={row?.['type']}
                    id={`chain-tab-${index}`}
                    aria-controls={`chain-tabpanel-${index}`}
                    className={classNames('normal-case text-inherit', {
                      'font-semibold text-base': chainsTab == index,
                    })}
                  />
                ))}
              </Tabs>
              <ul className="flex flex-wrap items-center py-2 gap-8">
                {_payChains()[chainsTab]?.['list'].map((item, index) => {
                  let avatarBox = ({ classes = null } = {}) => (
                    <Avatar
                      src={item?.icon || getActiveChain({ name: item?.name })?.icon}
                      className={classNames(
                        classes,
                        item?.['avatarClass'],
                        item?.disabled ? 'opacity-20' : 'cursor-pointer'
                      )}
                    />
                  )
                  return (
                    <li
                      key={`chain-tab-content-${index}`}
                      className="relative"
                      onClick={() => handleChainsSelect(item)}
                    >
                      <NmTooltip title={item?.disabled ? `${item?.name} Upcoming` : ''} placement="bottom">
                        {paymentForm?.chains.find(
                          row => getIncludesIgnoreCase(item?.name, row?.name) && item?.chainId == row?.['id']
                        ) && !item?.disabled ? (
                          <>
                            <NmBorderCounter
                              speed="smooth"
                              customClass="rounded-full p-1 bg-black transition-all"
                              innerClass="border-1"
                            >
                              {avatarBox({ classes: 'size-9' })}
                            </NmBorderCounter>
                            <Avatar className="size-5 scale-90 bg-black absolute -bottom-1 right-0">
                              <NmIcon type="icon-tick" className="text-xs font-semibold" />
                            </Avatar>
                          </>
                        ) : (
                          avatarBox({ classes: 'size-11' })
                        )}
                      </NmTooltip>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li className="flex justify-between">
              <Button
                size="large"
                variant="outlined"
                color="inherit"
                className="shadow-sm rounded-md w-20"
                onClick={() => {
                  setAccordionActive(0)
                }}
              >
                Back
              </Button>
              <Button
                size="large"
                variant="contained"
                color="inherit"
                className={classNames(
                  'shadow-sm rounded-md w-32 text-white',
                  paymentStep?.includes(1) ? 'bg-create-gradient-004' : 'bg-black'
                )}
                onClick={() => handlePaymentSecond()}
              >
                Next
              </Button>
            </li>
          </ul>
        )
      case 2:
        return (
          <ul>
            <li>
              <Grid2 container justifyContent="space-between" alignItems="center">
                <h2 className="font-medium">Theme</h2>
              </Grid2>
              <ul className="flex items-center justify-around gap-4 pt-6">
                {Array(6)
                  .fill(0)
                  .map((row, index) => (
                    <LandingCard
                      component="li"
                      key={`style-item-${index}`}
                      customClass="pt-2 !mt-0 size-12 rounded-full cursor-pointer"
                      tpls={{ style: `S00${index}` }}
                      onCardClick={() => setPaymentForm({ ...paymentForm, theme: index })}
                    >
                      {index == paymentForm?.theme && <NmIcon type="icon-tick" className="leading-0 text-xl" />}
                    </LandingCard>
                  ))}
              </ul>
            </li>

            <li>
              <Divider className="border-dashed" />
            </li>

            <li className="py-6">
              <Grid2 container justifyContent="space-between" alignItems="center">
                <h2 className="font-medium">Copyright</h2>
                <input
                  type="checkbox"
                  className="checkbox checkbox-success checkbox-lg"
                  checked={paymentForm?.copyright}
                  onChange={e => setPaymentForm({ ...paymentForm, copyright: e.target.checked })}
                />
              </Grid2>
            </li>

            <li className="pb-12">
              <Divider className="border-dashed" />
            </li>

            <li className="flex justify-between">
              <Button
                size="large"
                variant="outlined"
                color="inherit"
                className="shadow-sm rounded-md w-20"
                onClick={() => {
                  setAccordionActive(1)
                }}
              >
                Back
              </Button>
              <Button
                size="large"
                variant="contained"
                color="inherit"
                className={classNames(
                  'shadow-sm rounded-md w-32 text-white',
                  paymentStep.includes(0) && paymentStep.includes(1)
                    ? 'bg-create-gradient-004'
                    : 'bg-black/50 cursor-not-allowed'
                )}
                disabled={Object.keys(paymentFormTips)?.length > 0 || submitLoading}
                onClick={() => handlePaymentPublish()}
              >
                {submitLoading && <NmIcon type="icon-spin" className="animate-spin mr-2" />}
                Publish
              </Button>
            </li>
          </ul>
        )
      default:
        break
    }
  }
  return (
    <ul className="flex max-lg:flex-wrap gap-8 pt-8">
      <li className="w-full lg:w-1/2 border border-neutral-200/50 rounded-xl overflow-hidden">
        {paymentSteps.map((row, index) => (
          <Accordion
            key={`accordion-item-${index}`}
            className="shadow-none"
            expanded={index === accordionActive}
            onChange={handleAccordionChange(index)}
          >
            <AccordionSummary
              expandIcon={<NmIcon type="icon-arrow_down" className="text-2xl" />}
              aria-controls={`accordion-item-${index}-content`}
              className="py-3.5"
            >
              <Box className="flex items-center gap-3 leading-8">
                <Avatar
                  className={classNames('bg-black size-7', {
                    'bg-create-gradient-004':
                      index == 2 ? paymentStep.includes(0) && paymentStep.includes(1) : paymentStep?.includes(index),
                  })}
                >
                  {index + 1}
                </Avatar>
                <h1 className="font-semibold text-xl">{row?.name}</h1>
              </Box>
            </AccordionSummary>
            <AccordionDetails>{AccordionDetailsContent(index)}</AccordionDetails>
          </Accordion>
        ))}
      </li>
      <li className="w-full lg:w-1/2 mockup-browser border border-neutral-200/80 rounded-xl">
        {data?.id && (
          <Box className="mockup-browser-toolbar flex relative group">
            <Link
              href={preview_url}
              target="_blank"
              className="input leading-7 focus:border-transparent focus:outline-none focus:ring-0 bg-neutral-100"
            >
              {preview_url}
            </Link>
            <Chip
              label="Copy"
              color="success"
              className="opacity-0 group-hover:opacity-100 transition-all h-7 bg-black rounded-md absolute right-1.5 cursor-pointer"
              onClick={handlePayeeLinkCopy}
            />
          </Box>
        )}
        <Box
          className={classNames({
            'border-neutral-200/80 border-t': data?.id,
          })}
        >
          <PaymentLanding user={user} data={paymentForm} customClass="!grid-cols-1" contentClass="lg:px-6" />
        </Box>
      </li>
    </ul>
  )
}
