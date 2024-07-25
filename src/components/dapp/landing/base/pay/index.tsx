import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import {
  createQR,
  encodeURL,
  findReference,
  FindReferenceError,
  parseURL,
  TransferRequestURL,
  TransferRequestURLFields,
  validateTransfer,
  ValidateTransferError,
} from '@solana/pay'
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getMint } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import {
  useReadContract,
  useWriteContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useDisconnect,
  useBalance,
} from 'wagmi'
import { createConfig, readContract, readContracts } from '@wagmi/core'
import { erc20Abi, formatUnits, parseEther, parseUnits } from 'viem'
import classNames from 'classnames'
import { useDebounce, useDebounceFn } from 'ahooks'
import { Avatar, Box, Button, Link } from '@mui/material'
import NmIcon from '@/components/nm-icon'
import NmBorderCounter from '@/components/nm-border-counter'
import NmTooltip from '@/components/nm-tooltip'
import NmGlobalWallet from '@/components/nm-global-wallet'
import NmSpinInfinity from '@/components/nm-spin/infinity'
import { useSnackbar } from '@/components/context/snackbar'
import { getPaymentOrderSvc } from '@/services/pay'
import { get1InchTokenSvc, getJupTokenPriceSvc, getSolTokenListSvc } from '@/services/common'
import { getNFTOrScanUrl, getRandomNumber, getShortenMidDots } from '@/lib/utils'
import { useChainConnect, useEVMWalletConnect, useGlobalWalletConnect, useSolAccount, useUserData } from '@/lib/hooks'
import { payChains, _supportChains, wagmiCoreConfig } from '@/lib/chains'
import { getActiveChain, getSolanaRPCUrl } from '@/lib/web3'
import { env } from '@/lib/types/env'
import * as pay from '@/lib/chains/tokens'

import config from '@/config'

const { title, domains } = config

const PaymentCard = ({ ...props }) => {
  const { addressList } = props?.user || useUserData()
  const { solAddress } = useSolAccount()
  const evmWalletConnect = useEVMWalletConnect()
  const { address: payAddress, chainId, chainType } = useChainConnect()
  const globalWalletConnect = useGlobalWalletConnect()
  const { openConnectModal } = useConnectModal()
  const { disconnect } = useDisconnect()
  const { setVisible } = useWalletModal()
  const { publicKey, sendTransaction: solSendTransaction } = useWallet()

  const { showSnackbar } = useSnackbar()

  const [chainIndex, setChainIndex] = useState(0) // 默认次序0
  // 付款流程
  // 0 默认为输入状态
  // 1 选择代币状态
  // 2 补充信息状态
  // 3 钱包连接及付款状态
  // 4 付款异常或失败状态
  // 5 付款成功状态
  const [paymentType, setPaymentType] = useState(0)
  const [tokenSearch, setTokenSearch] = useState(false) // 代币搜索状态，默认为列表状态

  const [payInputValue, setPayInputValue] = useState(getRandomNumber(0, 5))
  const [payNote, setPayNote] = useState('')
  const debouncedPayNote = useDebounce(payNote, { wait: 100 })

  const [tokenListLoading, setTokenListLoading] = useState(false)
  const [tokenPriceLoading, setTokenPriceLoading] = useState(false)

  const [tokens, setTokenList] = useState({
    list: [],
    symbol: 'USDC',
    address: pay.solana.mocks.usdc,
  })
  const [tokenPrice, setTokenPrice] = useState(1)
  const tokensCache = useRef([])

  const solReceiptAccount = useMemo(
      () =>
        (addressList?.length > 0 && addressList.find(row => row.chain == 'sol')?.value) || env?.officialSolRecipient,
      [addressList]
    ),
    evmReceiptAccount = useMemo(
      () =>
        (addressList?.length > 0 && addressList.find(row => row.chain == 'evm')?.value) || env?.officialEvmRecipient,
      [addressList]
    )

  const tokensItem = useMemo(
    () => tokensCache?.current.find(row => row?.address == tokens.address),
    [tokensCache?.current, tokens.address]
  )

  const tokensAmount = useMemo(
    () => Number((payInputValue / tokenPrice)?.toFixed(5)),
    [payInputValue, tokenPrice, tokens.address]
  )
  // 本地调试EVM Chain对USDC的特殊处理，查Token Price仍用主网合约，本地调试用测试网合约
  const tokensEvm = useMemo(
    () =>
      !env?.isProd && tokens.address == payChains[chainIndex]?.['mocks']?.usdc?.mainnet
        ? payChains[chainIndex]?.['mocks']?.usdc?.sepolia
        : tokens.address,
    [tokens.address]
  )

  const payInputContinue = useMemo(() => {
    return (
      payInputValue && !String(payInputValue)?.endsWith('.') && !tokenPriceLoading && !payChains[chainIndex]?.disabled
    )
  }, [payInputValue, tokenPriceLoading, chainIndex])

  const payChainId = useMemo(() => chainIndex > 0 && (payChains[chainIndex]?.['chainId'] || chainId), [chainIndex])

  const disabledChain = useMemo(() => {
    let disabled = []
    if (!payChains[chainIndex]?.name) return []
    if (payChains[chainIndex]?.name?.indexOf('Solana') > -1) {
      disabled.push('EVM')
    } else {
      disabled.push('Solana')
    }
    return disabled
  }, [chainIndex])

  // 付款类型，二维码或直接付款
  const [paymentQr, setPaymentQr] = useState(false)
  const [qrLoading, setQrLoading] = useState(false)

  // 查询原生代币余额
  const {
    error: evmNativeBalanceError,
    isSuccess: evmNativeBalanceSuccess,
    data: evmNativeBalance,
  } = useBalance({
    address: chainType !== 'sol' && payAddress,
    chainId: payChainId,
    query: {
      enabled: globalWalletConnect && chainType !== 'sol' && chainIndex > 0,
      gcTime: 5000,
    },
  })

  //查询非原生代币 & EVM链 token余额
  // const {
  //   error: readContractError,
  //   isSuccess: evmOthersBalanceSuccess,
  //   data: evmOthersBalance,
  // } = useReadContract({
  //   abi: erc20Abi,
  //   account: chainType !== 'sol' && payAddress,
  //   address: tokensEvm,
  //   chainId: payChainId,
  //   functionName: 'balanceOf',
  //   args: [tokensEvm],
  //   query: {
  //     enabled: globalWalletConnect && chainType !== 'sol' && chainIndex > 0,
  //     gcTime: 5000,
  //   },
  // })

  const { switchChain } = useSwitchChain({
    mutation: {
      onError: (err, variables, context) => {
        handleTransactionError(err)
      },
      onSuccess: (data, variables, context) => {
        evmPay()?.sendToken()
      },
    },
  })

  const {
    error: writeContractError,
    data: evmOthersTxHash,
    writeContract,
  } = useWriteContract({
    mutation: {
      onError(err, variables, context) {
        handleTransactionError(err)
      },
      onSuccess(data, variables, context) {
        handlePaymentOrder({
          signature: data,
          payer: payAddress,
        })
      },
    },
  })

  const {
    isPending,
    error: sendTransactionError,
    data: evmNativeTxHash,
    sendTransaction,
  } = useSendTransaction({
    mutation: {
      onSuccess: hash => {},
      onError: err => {
        handleTransactionError(err)
      },
    },
  })

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: evmNativeTxHash,
  })

  // 交易信息
  const [txError, setTxError] = useState(null)
  const [txInfo, setTxInfo] = useState({
    signature: null,
    payer: null,
  })

  // ref to a div where we'll show the QR code
  const qrRef = useRef<HTMLDivElement>(null)
  const paymentAmount = useMemo(() => new BigNumber(tokensAmount), [tokensAmount])
  // 支付结果db状态（只能提交一次）
  const paymentSubmitedRef = useRef(false)

  let reference = Keypair.generate().publicKey

  const solanaPay = () => {
    if (chainIndex) return

    let recipient = new PublicKey(solReceiptAccount),
      // 发送的Token代币合约地址
      splToken = new PublicKey(tokens.address)
    // Unique address that we can listen for payments to

    let defaultParams = {
      recipient,
      amount: paymentAmount,
      reference,
      label: `Pay to ${solReceiptAccount}`,
      message: debouncedPayNote,
      memo: `By ${title}`,
    }
    // Solana Pay transfer params
    const solPaymentParams: TransferRequestURLFields =
      pay.solana.mocks.sol == tokens.address
        ? defaultParams
        : {
            ...defaultParams,
            splToken,
          }

    // Get a connection to solana rpc
    const endpoint = getSolanaRPCUrl()
    const connection = new Connection(endpoint)

    const solPaymentURL = encodeURL(solPaymentParams)

    const sendSol = async () => {
      if (!publicKey) throw new WalletNotConnectedError()

      const { recipient, amount, reference, memo } = parseURL(solPaymentURL) as TransferRequestURL

      if (!recipient || !amount || !reference) throw new Error('Invalid payment request link')

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: amount.multipliedBy(LAMPORTS_PER_SOL).integerValue(BigNumber.ROUND_FLOOR).toNumber(),
        })
      )

      if (memo != null) {
        await tx.add(
          new TransactionInstruction({
            programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
            keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
            data: Buffer.from(memo, 'utf8'),
          })
        )
      }

      const signature = await solSendTransaction(tx, connection)

      await connection.confirmTransaction(signature, 'processed')

      signature &&
        (await handlePaymentOrder({
          signature,
          payer: publicKey,
        }))

      console.log('SOL Transaction successful with signature:', signature)
    }

    const sendToken = async () => {
      if (!publicKey) throw new WalletNotConnectedError()

      const { recipient, amount, reference, memo } = parseURL(solPaymentURL) as TransferRequestURL

      if (!recipient || !amount || !reference) throw new Error('Invalid payment request link')

      const tokenMint = await getMint(connection, splToken)
      const tokenSourceAddress = await getAssociatedTokenAddress(splToken, publicKey)
      const tokenDestinationAddress = await getAssociatedTokenAddress(splToken, recipient)

      const transaction = new Transaction().add(
        createTransferCheckedInstruction(
          tokenSourceAddress, // 发送方的USDC代币账户地址
          splToken,
          tokenDestinationAddress, // 接收方的USDC代币账户地址
          publicKey,
          tokensAmount * 10 ** tokenMint.decimals, // amount to transfer (in units of the token)
          tokenMint.decimals // decimals of the  token
        )
      )

      if (memo != null) {
        await transaction.add(
          new TransactionInstruction({
            programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
            keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
            data: Buffer.from(memo, 'utf8'),
          })
        )
      }

      const signature = await solSendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'processed')
      console.log('USDC Transaction successful with signature:', signature)
      signature &&
        (await handlePaymentOrder({
          signature,
          payer: publicKey,
        }))
    }

    const getSolPaymentVerifyTx = async () => {
      console.log('6. 🐳 Verifying the payment')
      // Merchant app locates the transaction signature from the unique reference address it provided in the transfer link
      // When the status is pending, poll for the transaction using the reference key
      const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' })
      // Merchant app should always validate that the transaction transferred the expected amount to the recipient
      // When the status is confirmed, validate the transaction against the provided params
      const transfers = await validateTransfer(
        connection,
        signatureInfo?.signature,
        {
          recipient,
          amount: paymentAmount,
          splToken: pay.solana.mocks.sol == tokens.address ? undefined : splToken,
          reference,
        },
        { commitment: 'confirmed' }
      )
      // When the status is valid, poll for confirmations until the transaction is finalized
      const response = await connection.getSignatureStatus(signatureInfo?.signature)

      const status = response.value
      if (!status) return
      if (status.err) throw status.err

      return transfers
    }

    const sendCoin = async () => {
      try {
        if (tokens.symbol === 'SOL') {
          await sendSol()
        } else {
          await sendToken()
        }
      } catch (err) {
        if (err instanceof WalletNotConnectedError) {
          await delay(2000)
          if (publicKey) {
            if (tokens.symbol == 'SOL') {
              await sendSol()
            } else {
              await sendToken()
            }
          }
        } else {
          return handleTransactionError(err)
        }
      }
    }

    // Encode the params into the format shown
    return {
      connection,
      solPaymentParams,
      solPaymentURL,
      getSolPaymentVerifyTx,
      sendToken,
      sendSol,
      sendCoin,
    }
  }

  const evmPay = () => {
    // 发送其他代币
    const transferToken = ({ from, to, amount, address }) => {
      // 转账
      writeContract({
        abi: erc20Abi,
        address,
        account: payAddress,
        chain: payChainId,
        chainId: payChainId,
        functionName: 'transfer',
        args: [to, amount],
      })
    }
    return {
      sendToken: async () => {
        if (payChainId !== chainId) {
          switchChain({
            chainId: payChainId,
          })
        } else if (evmReceiptAccount) {
          let balanceFactory = val =>
            parseFloat(formatUnits((val?.value || val?.balance || val) as bigint, val?.decimals as number))
          // 发送原生代币
          if (tokensItem?.native) {
            if (
              tokensAmount >=
              (evmNativeBalanceSuccess && evmNativeBalance && evmNativeBalance?.value > 0
                ? balanceFactory(evmNativeBalance)
                : 0)
            ) {
              return handleTransactionError('Insufficient current account balance.')
            }
            sendTransaction({
              chainId: payChainId,
              to: evmReceiptAccount,
              value: parseEther(String(tokensAmount)),
              address: tokens.address,
            })
          } else {
            const evmOthersBalance = await readContract(createConfig(wagmiCoreConfig), {
              abi: erc20Abi,
              address: tokensEvm,
              chainId: payChainId,
              functionName: 'balanceOf',
              args: [payAddress],
            })
            const decimals = await readContract(createConfig(wagmiCoreConfig), {
              abi: erc20Abi,
              address: tokensEvm,
              chainId: payChainId,
              functionName: 'decimals',
              args: [],
            })
            if (
              tokensAmount >=
              (evmOthersBalance
                ? balanceFactory({
                    value: evmOthersBalance,
                    decimals,
                  })
                : 0)
            ) {
              return handleTransactionError('Insufficient current account balance.')
            }
            transferToken({
              from: payAddress,
              to: evmReceiptAccount,
              amount: parseUnits(tokensAmount.toString(), decimals),
              address: tokensEvm,
            })
          }
        } else {
        }
      },
    }
  }

  useEffect(() => {
    const sendCommon = () => (chainIndex ? evmPay()?.sendToken() : solanaPay()?.sendCoin())
    if (globalWalletConnect) {
      if (paymentType == 3) {
        sendCommon()
      }
      if (paymentType == 4) {
        if ((!chainIndex && chainType == 'sol') || (chainIndex && chainType !== 'sol')) {
          setPaymentType(3)
          sendCommon()
        }
      }
    }
  }, [globalWalletConnect, chainType])

  useEffect(() => {
    if (isConfirmed && paymentType !== 5) {
      handlePaymentOrder({
        signature: evmNativeTxHash,
        payer: payAddress,
      })
    }
  }, [isConfirmed])

  // Show the QR code
  useEffect(() => {
    if (chainIndex || paymentType !== 3) return
    setQrLoading(true)

    const { solPaymentURL } = solanaPay()
    const qr = createQR(solPaymentURL, 220)
    if (qrRef.current && paymentAmount.isGreaterThan(0)) {
      qrRef.current.innerHTML = ''
      qr.append(qrRef.current)
      setTimeout(_ => {
        setQrLoading(false)
      }, 500)
    }
  }, [paymentType, paymentQr, paymentAmount])

  // Check transaction is completed
  useEffect(() => {
    if (chainIndex || paymentType !== 3) return
    let interval,
      i = 0
    let changed = false
    const { getSolPaymentVerifyTx } = solanaPay()
    const onPaymentCheck = async () => {
      try {
        i++
        // 防止页面停止 & 暴力请求
        if (i > 200) return () => clearInterval(interval)

        let blocks = await getSolPaymentVerifyTx()

        let signature = blocks?.transaction?.signatures[0]
        // confirmed status
        if (!changed) {
          signature && (await handlePaymentOrder({ signature, payer: blocks?.transaction?.message?.accountKeys[0] }))
          clearInterval(interval)
        }
      } catch (e) {
        handleTokenTxReset()
        if (e instanceof FindReferenceError) {
          // No transaction found yet, ignore this error
          return
        }
        if (e instanceof ValidateTransferError) {
          // Transaction is invalid
          console.error('Transaction is invalid', e)
          clearInterval(interval)
          return showSnackbar({
            snackbar: {
              open: true,
              type: 'error',
              text: e?.name || e.message,
            },
          })
        }

        console.error('Unknown error', e)
      }
    }
    if (paymentQr) {
      interval = setInterval(onPaymentCheck, 3000)
    } else {
      changed = true
      clearInterval(interval)
    }
    return () => {
      changed = true
      clearInterval(interval)
    }
  }, [paymentType, paymentQr, paymentAmount])

  useEffect(() => {
    if (!tokensCache?.current?.length) {
      getChainsTokenList()
    }
  }, [tokens?.list, chainIndex])

  useEffect(() => {
    let interval
    if (paymentType !== 5) {
      interval = setInterval(() => {
        getTokenPrice()
      }, 6000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [paymentType, payInputValue, tokens.address])

  const delay = useCallback((ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }, [])

  // 扫码支付
  const getPaymentQrGo = () => {
    setPaymentQr(true)
    setPaymentType(3)
    switch (chainType) {
      case 'evm':
        if (globalWalletConnect) disconnect()
        break
      case 'sol':
      default:
        break
    }
  }

  // 插件支付
  const getPaymentPluginGo = async () => {
    setPaymentQr(false)
    setPaymentType(3)

    if (globalWalletConnect) {
      switch (chainType) {
        case 'evm':
        default:
          if (!chainIndex) {
            setVisible(true)
            disconnect()
            return handleTransactionError('Please connect solana chain first.')
          }
          evmPay()?.sendToken()

          break
        case 'sol':
          if (chainIndex > 0) {
            openConnectModal()
            return handleTransactionError('Please connect evm chain first.')
          }
          solanaPay()?.sendCoin()
          break
      }
    }
  }

  const getChainsTokenList = async () => {
    let res = []
    setTokenListLoading(true)
    switch (chainIndex) {
      case 0:
        res = await getSolTokenListSvc()
        if (!res?.length) res = pay.solana.list
        break
      default:
        res = payChains?.[chainIndex]?.['list']
        break
    }
    if (res?.length) {
      tokensCache.current = res
      let tokensNew = {
        symbol: res[0]?.symbol,
        address: res[0]?.address,
        list: res.slice(0, 20),
      }
      setTokenList(tokensNew)
      getTokenPrice(tokensNew.address)
    }
    setTokenListLoading(false)
  }

  const getJupTokenPrice = async ({ ids = tokensItem?.symbol }) => {
    setTokenPriceLoading(true)
    let res = await getJupTokenPriceSvc({ ids })
    if (res?.data?.[ids]?.price) {
      setTokenPrice(res?.data?.[ids]?.price)
    }
    setTokenPriceLoading(false)
  }

  const get1InchTokenPrice = async (address = null) => {
    address = (address || tokensItem?.address || tokens.address)?.toLowerCase()
    setTokenPriceLoading(true)

    let res = await get1InchTokenSvc({
      chainId: payChains[chainIndex]?.['chainIdProd'],
      address,
    })

    if (res?.[address] && Number(res?.[address])) {
      setTokenPrice(res?.[address])
    }
    setTokenPriceLoading(false)
  }

  const getTokenPrice = (address = null) => {
    switch (chainIndex) {
      case 0:
        if (tokens.address == pay.solana.mocks.usdc) return setTokenPrice(1)
        getJupTokenPrice({ ids: address || tokensItem?.symbol || tokens.address })
        break
      case 1:
      default:
        get1InchTokenPrice(address)
        break
    }
  }

  const { run: handleTokenListSearch } = useDebounceFn(
    val => {
      setTokenList({
        ...tokens,
        list: val
          ? tokensCache.current?.filter(row => row.symbol.toLowerCase().includes(val.toLowerCase()))
          : tokensCache.current.slice(0, 20),
      })
    },
    {
      wait: 250,
    }
  )

  const { run: handlePayInputChange } = useDebounceFn(
    ({ val, type }) => {
      if (/^\d*\.?\d*$/.test(val)) {
        // 如果输入值是数字或者带有小数点的数字
        let floatValue = type == 'add' ? payInputValue + val : val?.endsWith('.') ? val : parseFloat(val)
        if (!isNaN(floatValue) && floatValue >= 0 && floatValue <= 10000) {
          setPayInputValue(floatValue)
        } else if (floatValue > 10000) {
          setPayInputValue(10000)
        } else {
          setPayInputValue(0)
        }
      }
    },
    {
      wait: 50,
    }
  )

  const handleSwitchChain = async index => {
    if (payChains[index]?.disabled) return
    setChainIndex(index)
    if (paymentType > 1) setPaymentType(0)
    tokensCache.current = []
    setTokenList({
      ...tokens,
      list: [],
      symbol: payChains[index]['list'][0]?.symbol,
      address: payChains[index]['list'][0]?.address,
    })
  }

  const handleTokenTxReset = () => {
    if (paymentType == 5) {
      setTxInfo({
        signature: null,
        payer: null,
      })
    }
  }

  const handleTokenListReset = () => {
    setTokenSearch(false)
    handleTokenListSearch(null)
    handleTokenTxReset()
  }

  const handleTransactionError = err => {
    let errInfo = err ? JSON.parse(JSON.stringify(err)) : {},
      errText =
        errInfo?.shortMessage ||
        errInfo?.message ||
        errInfo?.name ||
        (typeof errInfo == 'string' && errInfo) ||
        'Transaction error ˙◠˙'
    setPaymentType(4)
    setTxError(errText)
    showSnackbar({
      snackbar: {
        open: true,
        type: 'error',
        text: errText,
      },
    })
  }

  const handlePaymentOrder = async data => {
    setPayNote('')
    setTxError(null)
    setPaymentType(5)
    setTxInfo({
      ...txInfo,
      signature: data.signature,
      payer: payAddress,
    })
    if (paymentType == 3) setPaymentQr(false)
    if (!paymentSubmitedRef?.current) {
      paymentSubmitedRef.current = true // 设置状态为已提交
      // 只在第一次循环中进行支付结果提交
      let paymentOrderParams = {
        chain: payChains[chainIndex]?.name,
        contract: tokens?.address,
        symbol: tokens?.symbol,
        amount: tokensAmount,
        signature: data?.signature,
        payer: data?.payer,
        payeeId: props?.payeeId,
      }
      if (debouncedPayNote) paymentOrderParams = Object.assign(paymentOrderParams, { message: debouncedPayNote })
      if (payChainId) paymentOrderParams = { ...paymentOrderParams, ...{ chainId: payChainId } }
      let res = await getPaymentOrderSvc(paymentOrderParams, 'post')
      if (res?.ok) {
        paymentSubmitedRef.current = false
        console.log('💎 Payment submit success.')
        showSnackbar({
          snackbar: {
            open: true,
            type: 'success',
            text: 'Transaction submitted success ᵔ◡ᵔ',
          },
        })
      }
    }
  }

  const chainAvatarClass = 'bg-transparent rounded-md p-1.5 size-9'
  const walletClass = 'w-full py-3 text-lg rounded-lg shadow-sm bg-create-gradient-004'

  const accountStatus = ({ children = null, type = 0, actions = true } = {}) => (
    <section className={classNames('text-center')}>
      {paymentType == 3 && paymentQr ? (
        <header className="flex justify-center my-2">
          {qrLoading && <NmSpinInfinity absoluteYCenter customClass="scale-150 -mt-14" />}
          <div ref={qrRef} className="rounded-2xl overflow-hidden" />
        </header>
      ) : (
        children
      )}
      <ul className="py-4 font-medium flex flex-col gap-2">
        <li className="flex items-center justify-between text-lg rounded-lg h-13 px-4 bg-black/10 backdrop-blur">
          <span>Amount</span>
          <strong className="font-firasans text-1.5xl">{`$ ${payInputValue}`}</strong>
        </li>
        <li className="group/item flex items-center justify-between text-lg rounded-lg h-13 px-4 bg-black/10 backdrop-blur">
          <p className="flex items-center">
            <span>Tax（Beta）</span>
            <Image
              alt=""
              width={26}
              height={26}
              draggable={false}
              src={`${domains.cdn}/status/icon_earth_01.svg`}
              className="ml-2 animate-spin animate-duration-10 transition-all hidden group-hover/item:inline"
            />
          </p>
          <strong className="font-firasans text-1.5xl flex items-center">{`$ 0`}</strong>
        </li>
        <li className="flex items-center justify-between rounded-lg h-13 px-4 bg-black/10 backdrop-blur">
          <Avatar src={tokensItem?.logoURI || tokensItem?.icon_url} className="size-7" />
          <p className="font-normal text-sm">
            <strong>{tokensAmount}</strong>

            {globalWalletConnect
              ? `／${getShortenMidDots((evmWalletConnect && evmReceiptAccount) || (solAddress && solReceiptAccount), 4)}`
              : ''}
          </p>
        </li>
      </ul>
      {actions && (
        <footer>
          <ul className="pt-4 flex items-center justify-between gap-2">
            <li>
              <Button
                color="inherit"
                size="large"
                variant="outlined"
                className="rounded-lg text-lg h-13 opacity-50 hover:opacity-60 transition"
                onClick={() => {
                  setPaymentType(type)
                  if (paymentType == 4 || paymentType == 5) setPayNote('')
                  handleTokenTxReset()
                }}
              >
                Back
              </Button>
            </li>
            <li
              className={classNames({
                'flex-1': !globalWalletConnect,
              })}
            >
              <NmGlobalWallet disables={disabledChain} walletClass={walletClass} connectClass={walletClass} />
            </li>
          </ul>
          {globalWalletConnect && paymentType == 4 && (
            <Box className="mt-4">
              <NmBorderCounter speed="smooth" customClass="rounded-lg py-[0.32rem]" innerClass="border-1">
                <Button
                  fullWidth
                  color="inherit"
                  size="large"
                  variant="outlined"
                  className="text-lg h-full border-0"
                  onClick={getPaymentPluginGo}
                >
                  Pay again
                </Button>
              </NmBorderCounter>
            </Box>
          )}
        </footer>
      )}
    </section>
  )

  const payContent = type => {
    switch (type) {
      case 0:
        return (
          <section className="text-center">
            <ul className="my-16 font-firasans">
              <li className="relative text-7xl font-extrabold">
                <strong className="-mt-0.5 -ml-4 absolute top-1/2 -translate-y-1/2">$</strong>
                <input
                  value={payInputValue}
                  onChange={e => handlePayInputChange({ val: e.target.value })}
                  className="w-60 pl-7 text-7xl text-center bg-transparent border-gray-400/50 border-dashed border-0 border-b outline-0 focus:ring-0"
                />
              </li>
              <li className="text-lg sm:text-xl p-1 truncate">
                {tokenPrice ? (
                  <p
                    className={classNames({
                      'animate__animated animate__fadeIn': tokenPriceLoading,
                    })}
                  >
                    ≈ {tokensAmount} {tokensItem?.symbol}
                  </p>
                ) : (
                  <Box className="font-normal text-theme-error/80 text-sm">
                    request error
                    <Button
                      size="small"
                      variant="outlined"
                      className="rounded-md scale-80"
                      onClick={() =>
                        chainIndex ? get1InchTokenPrice() : getJupTokenPrice({ ids: tokensItem?.symbol })
                      }
                    >
                      Try
                    </Button>
                  </Box>
                )}
              </li>
            </ul>

            <ul className="flex justify-center gap-4">
              {[1, 5, 10, 25].map(row => (
                <li
                  key={`pay-number-add-${row}`}
                  className="select-none font-firasans rounded-md py-1 sm:py-1.5 w-24 bg-transparent border border-gray-300/50 hover:border-gray-300 transition-all cursor-pointer"
                  onClick={() => handlePayInputChange({ type: 'add', val: row })}
                >
                  + ${row}
                </li>
              ))}
            </ul>
            <footer className="pt-6 flex justify-center">
              <NmBorderCounter
                speed="smooth"
                customClass={classNames(
                  'w-full max-w-md cursor-pointer rounded-lg text-lg py-[0.7rem] shadow-sm transition-all',
                  {
                    'opacity-50 !cursor-not-allowed': !payInputContinue,
                  }
                )}
                innerClass={classNames('border-1', { 'opacity-50': !payInputContinue })}
                onClick={() => payInputContinue && setPaymentType(2)}
              >
                Continue
              </NmBorderCounter>
            </footer>
          </section>
        )
        break
      case 1:
        return (
          <section>
            <header className="pb-2 flex justify-between items-center">
              <h1 className="text-xl font-righteous">
                {payChains[chainIndex]?.name}
                {!tokenSearch && <span className="pl-1 max-sm:hidden">Chain</span>}
              </h1>
              {tokenSearch ? (
                <Box className="ml-3 flex-1 relative animate__animated animate__fadeIn">
                  <NmIcon type="icon-search" className="text-lg absolute left-0 bottom-0" />
                  <input
                    autoFocus
                    placeholder="Search by token name"
                    className="w-full pl-6 pr-12 truncate border-0 border-b border-gray-300/90 bg-transparent outline-0 focus:ring-0 placeholder-gray-300/80 placeholder-shown:truncate"
                    onChange={e => handleTokenListSearch(e.target.value)}
                  />
                  <span
                    className="absolute right-0 bottom-0.5 px-2 py-0.5 rounded-md bg-black/10 backdrop-blur text-sm cursor-pointer"
                    onClick={handleTokenListReset}
                  >
                    ESC
                  </span>
                </Box>
              ) : (
                <NmIcon
                  type="icon-search"
                  className="text-1.5xl leading-0 cursor-pointer"
                  onClick={() => setTokenSearch(true)}
                />
              )}
            </header>
            <ul className="scrollbar-hide overflow-y-auto h-88 flex flex-col gap-2">
              {tokenListLoading ? (
                <NmSpinInfinity customClass="mt-24 mx-auto text-lg scale-150" />
              ) : tokens?.list?.length > 0 ? (
                tokens?.list.map((row, index) => (
                  <li
                    key={`token-item-${row?.symbol}-${index}`}
                    className={classNames(
                      'flex items-center justify-between p-2  transition rounded-md cursor-pointer group/item',
                      row?.address == tokens.address ? 'border border-stone-300' : 'hover:bg-black/10 backdrop-blur'
                    )}
                    onClick={() => {
                      setTokenList({ ...tokens, address: row?.address, symbol: row?.symbol })
                      chainIndex ? get1InchTokenPrice(row?.address) : getJupTokenPrice({ ids: row.symbol })
                      setPaymentType(0)
                      handleTokenListReset()
                    }}
                  >
                    <Box className="relative">
                      <Avatar src={row?.logoURI || row?.icon_url} className="size-9 sm:size-10" />
                      <Avatar
                        src={payChains[chainIndex]?.icon || getActiveChain({ name: payChains[chainIndex]?.name })?.icon}
                        className="size-4 p-0.5 bg-black border absolute bottom-0 right-0"
                      />
                    </Box>
                    <ul className="flex-1 flex items-center px-2 gap-2">
                      <li>
                        <h3 className="truncate font-medium">{row?.symbol}</h3>
                        <p className="text-sm line-clamp-1 opacity-60">{row?.name}</p>
                      </li>
                      {row?.address && (
                        <li className="p-0.5 px-1.5 text-xxs 2xs:text-xs 2xs:scale-95 rounded border hidden group-hover/item:inline transition">
                          <NextLink
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            onClick={
                              // Stop event propagation to prevent triggering parent onClick
                              e => e.stopPropagation()
                            }
                            href={getNFTOrScanUrl({
                              type: 'address',
                              address: row?.address,
                              ...(chainIndex ? { chainId: payChainId } : { chain: 'solana' }),
                            })}
                            className="flex gap-1 items-center"
                          >
                            {getShortenMidDots(row?.address, 4)}
                            <NmIcon type="icon-share" className="leading-0" />
                          </NextLink>
                        </li>
                      )}
                    </ul>
                    <NmIcon
                      type={`icon-${row?.address == tokens.address ? 'safe' : 'plus'}`}
                      className={classNames('leading-0 text-xl sm:text-1.5xl', {
                        'hidden group-hover/item:inline transition': row?.address !== tokens.address,
                      })}
                    />
                  </li>
                ))
              ) : (
                <li className="text-center mt-36">
                  <h4 className="text-xl opacity-60">No tokens found</h4>
                  <p>
                    <span className="opacity-50">Give us</span>
                    <NextLink
                      href="https://x.com/CoindPay"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="px-1.5"
                    >
                      feedback
                    </NextLink>
                    <span className="opacity-50">to support more.</span>
                  </p>
                </li>
              )}
            </ul>
          </section>
        )
        break
      case 2:
        return (
          <section className="pt-4">
            <textarea
              value={payNote}
              placeholder={`Leave a encrypted message for payment of $${payInputValue} and visible to you and the creator only.`}
              className="resize-none min-h-68 rounded-lg whitespace-pre-wrap w-full p-4 bg-transparent border-gray-300/30 focus:border-gray-300/70 outline-0 focus:ring-0 placeholder-gray-300/70"
              onChange={e => setPayNote(e.target.value)}
            />
            <ul className="flex justify-center pt-6 gap-4">
              <li className="flex-1">
                <Button
                  fullWidth
                  color="inherit"
                  size="large"
                  variant="outlined"
                  className="rounded-lg text-lg h-full"
                  startIcon={
                    <NmIcon
                      type="icon-qrcode"
                      className="sm:mr-4 animate__animated animate__swing animate__infinite animate__slower"
                    />
                  }
                  disabled={chainIndex !== 0}
                  onClick={getPaymentQrGo}
                >
                  QR code
                </Button>
              </li>
              <li className="flex-1">
                <NmBorderCounter speed="smooth" customClass="rounded-lg py-1" innerClass="border-1">
                  <Button
                    fullWidth
                    color="inherit"
                    size="large"
                    variant="outlined"
                    className="text-lg h-full border-0"
                    onClick={getPaymentPluginGo}
                  >
                    Pay
                  </Button>
                </NmBorderCounter>
              </li>
            </ul>
          </section>
        )
        break
      case 3:
        return accountStatus({
          children: globalWalletConnect ? (
            <header className="flex items-center flex-col py-8">
              <NmSpinInfinity customClass="text-lg scale-150" />
              <h3 className="text-lg font-medium pt-4">Sending . . .</h3>
            </header>
          ) : (
            <header className="flex items-center flex-col py-8">
              <Image
                alt=""
                width={250}
                height={250}
                draggable={false}
                src={`${domains.cdn}/status/icon_empty_assets_01.svg`}
                className="ml-6 animate__animated animate__swing animate__infinite animate__slower animate__delay-1s animate-duration-5"
              />
              <h3 className="text-lg font-medium pt-4">Please connect wallet first.</h3>
            </header>
          ),
          type: 2,
        })
        break
      case 4:
        return accountStatus({
          children: (
            <header className="flex flex-col pt-8">
              <NmIcon
                type="icon-error_outline"
                className="mb-8 text-6xl text-theme-error animate__animated animate__rubberBand animate__infinite animate__slower animate__delay-1s"
              />
              <h3 className="text-1.5xl font-semibold py-1">Transaction falied</h3>
              <p className="pb-6">{txError || 'Please check balance and try again.'}</p>
            </header>
          ),
        })
        break
      case 5:
        return accountStatus({
          children: (
            <header className="flex flex-col py-8">
              <NmIcon
                type="icon-status_success"
                className="text-6xl text-theme-success animate__animated animate__heartBeat animate__infinite animate__slower animate__delay-1s"
              />
              <h3 className="text-1.5xl font-semibold pt-6">Congratulations.</h3>
              {txInfo?.signature && (
                <p className="text-sm pt-1 ">
                  Transaction hash
                  <NextLink
                    href={getNFTOrScanUrl({
                      type: 'tx',
                      hash: txInfo?.signature,
                      ...(chainIndex ? { chainId } : { chain: 'solana' }),
                    })}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="pl-1.5 opacity-50"
                  >
                    {getShortenMidDots(txInfo?.signature)}
                  </NextLink>
                </p>
              )}
            </header>
          ),
        })
        break
      default:
        break
    }
  }
  return (
    <article className="flex-1 animate__animated animate__fadeIn px-2">
      <section className="py-8 flex justify-between items-center">
        <ul className="carousel gap-3 flex-1">
          {payChains.map((item, index) => {
            let avatarBox = ({ classes = null } = {}) => (
              <Avatar
                src={item?.icon || getActiveChain({ name: item?.name })?.icon}
                className={classNames(chainAvatarClass, classes, {
                  'cursor-pointer': !item?.disabled,
                })}
              />
            )
            return (
              <li key={`chain-item-${item?.name}`} className="carousel-item" onClick={() => handleSwitchChain(index)}>
                <NmTooltip title={item?.disabled ? 'Upcoming' : ''}>
                  {index == chainIndex && !item?.disabled ? (
                    <NmBorderCounter speed="smooth" customClass="rounded-md transition-all" innerClass="border-1">
                      {avatarBox()}
                    </NmBorderCounter>
                  ) : (
                    avatarBox({ classes: 'border border-gray-100/50 hover:border-2 transition-all' })
                  )}
                </NmTooltip>
              </li>
            )
          })}
          <li className="carousel-item">
            <NmTooltip title="More">
              <Avatar className={classNames('border border-gray-100/80', chainAvatarClass)}>
                <NmIcon type="icon-more_colors" />
              </Avatar>
            </NmTooltip>
          </li>
        </ul>
        <NmBorderCounter
          speed="smooth"
          customClass={classNames(
            'flex gap-2 items-center justify-center min-w-20 px-2.5 py-1 ml-3 rounded-md cursor-pointer'
          )}
          innerClass="border-1"
          onClick={() => {
            setPaymentType(!paymentType ? 1 : 0)
            if (paymentType !== 1) handleTokenListReset()
          }}
        >
          {!paymentType ? (
            tokenListLoading ? (
              <NmSpinInfinity />
            ) : (
              <>
                <Avatar src={tokensItem?.logoURI || tokensItem?.icon_url} className="size-4.5" />
                {tokensItem?.symbol}
              </>
            )
          ) : (
            'ESC'
          )}
        </NmBorderCounter>
      </section>
      {payContent(paymentType)}
    </article>
  )
}

export default PaymentCard
