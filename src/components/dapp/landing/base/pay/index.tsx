import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
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
import { AnchorProvider, Program, Idl, web3 } from '@coral-xyz/anchor'
import solanaIDL from '@/contracts/solana/target/idl/coindpay.json'
import BigNumber from 'bignumber.js'
import { getToken } from '@lifi/sdk'
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
import { makeStyles } from '@mui/styles'
import { Avatar, Box, Button, SwipeableDrawer, Tab, Tabs, useMediaQuery } from '@mui/material'
import NmIcon from '@/components/nm-icon'
import NmBorderCounter from '@/components/nm-border-counter'
import NmTooltip from '@/components/nm-tooltip'
import NmGlobalWallet from '@/components/nm-global-wallet'
import NmSpinInfinity from '@/components/nm-spin/infinity'
import { rootElement } from '@/components/context'
import { useSnackbar } from '@/components/context/snackbar'
import LandingCard from '../card'
import { getPaymentOrderSvc } from '@/services/pay'
import {
  get1InchTokenSvc,
  getSushiTokenSvc,
  getLiFiTokenSvc,
  getJupTokenPriceSvc,
  getSolTokenListSvc,
} from '@/services/common'
import { getIncludesIgnoreCase, getNFTOrScanUrl, getRandomNumber, getShortenMidDots, isiOS } from '@/lib/utils'
import {
  useChainConnect,
  useEVMWalletConnect,
  useGlobalWalletConnect,
  useInitPayChainIndex,
  useSolAccount,
  useUserData,
} from '@/lib/hooks'
import * as pay from '@/lib/chains/tokens'
import { payChains, _payChains, wagmiCoreConfig } from '@/lib/chains'
import { getActiveChain, getSvmRpcUrl } from '@/lib/web3'
import { env } from '@/lib/types/env'

import config from '@/config'

const { title, domains, logo } = config

const useStyles = makeStyles({
  paper: {
    backgroundColor: 'transparent',
  },
})

const PaymentWidget = ({ ...props }) => {
  let { payee = {}, widgetForm, customClass } = props

  let lgScreen = useMediaQuery('(min-width:1024px)')

  const classes = useStyles()

  const router = useRouter()
  const { addressList } = props?.user || useUserData()
  const { solAddress } = useSolAccount()

  const globalWalletConnect = useGlobalWalletConnect()
  const evmWalletConnect = useEVMWalletConnect()

  const { address: payAddress, chainId, chainType } = useChainConnect()

  const { openConnectModal } = useConnectModal()
  const { disconnect } = useDisconnect()
  const { setVisible } = useWalletModal()
  const { publicKey, sendTransaction: solSendTransaction } = useWallet()

  const { showSnackbar } = useSnackbar()

  const [chainsTab, setChainsTab] = useState(0)

  // 来自路由的 chain 次序
  const payChainIndex = useInitPayChainIndex(payee?.chains)
  const [chainIndex, setChainIndex] = useState(payChainIndex)

  const maxAmount = payee?.maxAmount || 100000

  const chainList = useMemo(() => {
    if (!payee?.chains?.length) return []
    return payChains.filter(item => {
      const isNameIncluded = payee?.chains.some(row => getIncludesIgnoreCase(item.name, row.name))
      const isChainIdMatch = payee?.chains.some(row => item?.['chainId'] === row.id)
      return !item.disabled && isNameIncluded && isChainIdMatch
    })
  }, [payee?.chains])

  const chainListTabs = useMemo(() => _payChains(chainList), [chainList])

  const chainItem = useMemo(() => chainList[chainIndex], [chainList, chainIndex])

  const [chainItemSwitch, setChainItemSwitch] = useState(false)

  const payBoxRef = useRef<HTMLDivElement>(null)

  // 付款流程
  // 0 默认为输入状态
  // 1 选择代币状态
  // 2 补充信息状态
  // 3 钱包连接及付款状态
  // 4 付款异常或失败状态
  // 5 付款成功状态
  const [paymentType, setPaymentType] = useState(0)
  const [tokenSearch, setTokenSearch] = useState(false) // 代币搜索状态，默认为列表状态

  const [payInputValue, setPayInputValue] = useState(
    payee?.amountType != 2 ? payee?.price : getRandomNumber(0, payee?.maxAmount > 10 ? payee?.maxAmount : 10)
  )

  const [payNote, setPayNote] = useState('')
  const debouncedPayNote = useDebounce(payNote, { wait: 100 })

  const [tokenListLoading, setTokenListLoading] = useState(false)
  const [tokenPriceLoading, setTokenPriceLoading] = useState(false)

  const [tokens, setTokenList] = useState({
    list: [],
    symbol: '',
    address: '',
  })

  const [tokenPrice, setTokenPrice] = useState(1)
  const tokensCache = useRef([])

  const solReceiptAccount = useMemo(
      () =>
        (addressList?.length > 0 && addressList.find(row => ['svm', 'sol'].includes(row.chain))?.value) ||
        env?.officialSolRecipient,
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
      !env?.isProd && tokens.address == chainItem?.['mocks']?.usdc?.mainnet
        ? chainItem?.['mocks']?.usdc?.dev
        : tokens.address,
    [tokens.address]
  )

  const payInputContinue = useMemo(
    () =>
      payee?.status == -1 || chainItem?.disabled ? false : !String(payInputValue)?.endsWith('.') && !tokenPriceLoading,

    [payInputValue, tokenPriceLoading, chainItem, payee?.status]
  )

  const payChainId = useMemo(() => chainItem?.['chainId'] || chainId, [chainIndex])

  const disabledChains = useMemo(
    () => [...new Set(chainList.filter(item => item?.type !== chainItem?.type)?.map(row => row?.type))],
    [chainIndex]
  )

  // 付款类型，二维码或直接付款
  const [paymentQr, setPaymentQr] = useState(false)
  const [qrLoading, setQrLoading] = useState(false)

  // 查询原生代币余额
  const {
    error: evmNativeBalanceError,
    isSuccess: evmNativeBalanceSuccess,
    data: evmNativeBalance,
  } = useBalance({
    address: chainType !== 'svm' && payAddress,
    chainId: payChainId,
    query: {
      enabled: globalWalletConnect && chainType !== 'svm' && chainItem?.type == 'EVM',
      gcTime: 5000,
    },
  })

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

  const svmPay = () => {
    if (chainItem?.type != 'SVM') return

    const reference = Keypair.generate().publicKey

    let recipient = new PublicKey(solReceiptAccount), // 收款账户
      splToken = new PublicKey(tokens.address) // 发送Token合约地址

    let defaultParams = {
      recipient,
      amount: paymentAmount,
      reference,
      label: `Pay to ${solReceiptAccount}`,
      message: debouncedPayNote,
      memo: `By ${title}`,
    }

    // SVM Pay transfer params
    const solPaymentParams: TransferRequestURLFields =
      pay.solana.mocks.sol.mainnet == tokens.address
        ? defaultParams
        : {
            ...defaultParams,
            splToken,
          }

    // Get a connection to SVM RPC
    const endpoint = getSvmRpcUrl(getIncludesIgnoreCase(chainItem?.name, 'soon') && { chain: 'soon' })
    const connection = new Connection(endpoint, 'processed')

    const provider = new AnchorProvider(connection, window?.solana, {
      preflightCommitment: 'processed',
    })

    const program = new Program(solanaIDL as Idl, provider)

    const solPaymentURL = encodeURL(solPaymentParams)

    const sendSol = async () => {
      if (!publicKey) throw new WalletNotConnectedError()

      const { recipient, amount, reference, memo } = parseURL(solPaymentURL) as TransferRequestURL

      if (!recipient || !amount || !reference) throw new Error('Invalid payment request link')

      // const tx = new Transaction().add(
      //   SystemProgram.transfer({
      //     fromPubkey: publicKey,
      //     toPubkey: recipient,
      //     lamports: amount.multipliedBy(LAMPORTS_PER_SOL).integerValue(BigNumber.ROUND_FLOOR).toNumber(),
      //   })
      // )

      // if (memo != null) {
      //   tx.add(
      //     new TransactionInstruction({
      //       programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
      //       keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
      //       data: Buffer.from(memo, 'utf8'),
      //     })
      //   )
      // }

      // const signature = await solSendTransaction(tx, connection)

      // await connection.confirmTransaction(signature, 'processed')

      // signature &&
      //   (await handlePaymentOrder({
      //     signature,
      //     payer: publicKey,
      //   }))

      const tx = await program.methods
        .paySol(
          amount.multipliedBy(LAMPORTS_PER_SOL).integerValue(BigNumber.ROUND_FLOOR).toNumber(), // 将支付金额转换为 lamports
          reference,
          memo
        )
        .accounts({
          payer: publicKey, // 付款方地址
          recipient, // 收款方地址
          systemProgram: SystemProgram.programId, // 系统程序
        })
        .rpc() // 提交交易

      console.log('SOL Transaction successful with signature:', tx)

      await connection.confirmTransaction(tx, 'processed')

      // 如果交易成功，处理支付订单
      tx &&
        (await handlePaymentOrder({
          signature: tx,
          payer: publicKey,
        }))
    }

    const sendToken = async () => {
      if (!publicKey) throw new WalletNotConnectedError()

      const { recipient, amount, reference, memo } = parseURL(solPaymentURL) as TransferRequestURL

      if (!recipient || !amount || !reference) throw new Error('Invalid payment request link')

      const tokenMint = await getMint(connection, splToken)

      const tokenSourceAddress = await getAssociatedTokenAddress(splToken, publicKey)

      const tokenDestinationAddress = await getAssociatedTokenAddress(splToken, recipient)

      const transaction = await program.methods
        .payToken(tokensAmount * 10 ** tokenMint.decimals, reference, memo)
        .accounts({
          payer: publicKey,
          recipient,
          tokenMint: splToken,
          tokenSource: tokenSourceAddress,
          tokenDestination: tokenDestinationAddress,
          systemProgram: SystemProgram.programId, // 需要传入系统程序
        })
        .rpc()

      await connection.confirmTransaction(transaction, 'processed')

      // 如果交易成功，处理支付订单
      transaction &&
        (await handlePaymentOrder({
          signature: transaction,
          payer: publicKey,
        }))

      // const transaction = new Transaction().add(
      //   createTransferCheckedInstruction(
      //     tokenSourceAddress, // 发送方代币账户地址
      //     splToken,
      //     tokenDestinationAddress, // 接收方代币账户地址
      //     publicKey,
      //     tokensAmount * 10 ** tokenMint.decimals, // amount to transfer (in units of the token)
      //     tokenMint.decimals // decimals of the  token
      //   )
      // )

      // if (memo != null) {
      //   await transaction.add(
      //     new TransactionInstruction({
      //       programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
      //       keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
      //       data: Buffer.from(memo, 'utf8'),
      //     })
      //   )
      // }

      // const signature = await solSendTransaction(transaction, connection)
      // await connection.confirmTransaction(signature, 'processed')

      // signature &&
      //   (await handlePaymentOrder({
      //     signature,
      //     payer: publicKey,
      //   }))

      console.log('SPL Token Transaction successful with signature:', transaction)
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
          splToken: pay.solana.mocks.sol.mainnet == tokens.address ? undefined : splToken,
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

    // Encode the params into the format shown
    return {
      connection,
      solPaymentParams,
      solPaymentURL,
      getSolPaymentVerifyTx,
      sendSol,
      sendToken,
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
    const sendCommon = () => (chainItem?.type == 'EVM' ? evmPay()?.sendToken() : svmPay()?.sendCoin())
    if (globalWalletConnect) {
      if (paymentType == 3) {
        sendCommon()
      }
      if (paymentType == 4) {
        if ((chainItem?.type == 'SVM' && chainType == 'svm') || (chainItem?.type == 'EVM' && chainType !== 'svm')) {
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

  useEffect(() => {
    if (chainItem?.type != 'SVM' || paymentType !== 3) return
    // Show QrCode
    setQrLoading(true)

    const { solPaymentURL } = svmPay()
    const qr = createQR(solPaymentURL, 180)
    if (qrRef.current && paymentAmount.isGreaterThan(0)) {
      qrRef.current.innerHTML = ''
      qr.append(qrRef.current)
      setTimeout(_ => {
        setQrLoading(false)
      }, 888)
    }
    // Check transaction completed
    let interval,
      i = 0
    let changed = false
    const { getSolPaymentVerifyTx } = svmPay()
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
  }, [tokens?.list, chainIndex, chainList])

  useEffect(() => {
    handleChainsSelect(chainIndex)
  }, [chainItem])

  useEffect(() => {
    if (!tokens?.list?.length) return

    getTokenPrice()

    let interval
    if (paymentType !== 5) {
      interval = setInterval(() => {
        getTokenPrice()
      }, 6000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [paymentType, payInputValue, chainIndex, tokens?.list, tokens.address, tokens.symbol])

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
      case 'svm':
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
          if (chainItem?.type == 'SVM') {
            setVisible(true)
            disconnect()
            return handleTransactionError('Please connect solana chain first.')
          }
          evmPay()?.sendToken()

          break
        case 'sol':
        case 'svm':
          if (chainItem?.type == 'EVM') {
            openConnectModal()
            return handleTransactionError('Please connect evm chain first.')
          }
          svmPay()?.sendCoin()
          break
      }
    }
  }

  const getChainsTokenList = async () => {
    let res = []
    setTokenListLoading(true)

    if (getIncludesIgnoreCase(chainItem?.name, 'solana')) {
      res = await getSolTokenListSvc()
      if (!res?.length) res = pay.solana.list
    } else {
      res = chainItem?.['list']
    }

    if (res?.length) {
      tokensCache.current = res

      setTokenList({
        symbol: res[0]?.symbol,
        address: res[0]?.address,
        list: res.slice(0, 20),
      })
    }

    setTokenListLoading(false)
  }

  const getTokenPrice = async (address = null) => {
    setTokenPriceLoading(true)
    address = address || tokens?.address
    let chain_id = chainItem?.['chainIdProd'],
      tokens_item = tokens?.list?.find(row => row?.address == address)

    // mock testnet chain data
    if (tokens_item?.price) {
      setTokenPrice(Number(tokens_item?.price))
      setTokenPriceLoading(false)
      return
    }
    if (tokens_item?.price_address) address = tokens_item?.price_address
    //
    let res = await getToken(chain_id, address)
    if (res?.priceUSD) {
      setTokenPrice(Number(res?.priceUSD))
    }
    setTokenPriceLoading(false)
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
      if (payee?.amountType != 2) {
      }
      if (/^\d*\.?\d*$/.test(val)) {
        // 如果输入值是数字或者带有小数点的数字
        let floatValue = type == 'add' ? payInputValue + val : val?.endsWith('.') ? val : parseFloat(val)
        if (!isNaN(floatValue) && floatValue >= 0 && floatValue <= maxAmount) {
          setPayInputValue(floatValue)
        } else if (floatValue > maxAmount) {
          setPayInputValue(maxAmount)
        } else {
          setPayInputValue(0)
        }
      }
    },
    {
      wait: 50,
    }
  )

  const handleChainsSelect = async (index, type = null) => {
    if (chainItem?.disabled) return
    if (type == 'default') setChainIndex(index)

    const formattedChainName = chainItem.name.replace(/\s+/g, '_')
    // 构建新的 URL，确保不会重复添加链参数
    const newQuery = { ...router.query, chain: formattedChainName }
    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true } // 使用 shallow 避免页面完全重新加载
    )

    if (paymentType > 1) setPaymentType(0)

    tokensCache.current = []

    setTokenList({
      ...tokens,
      list: [],
      symbol: chainItem['list'][0]?.symbol,
      address: chainItem['list'][0]?.address,
    })
  }

  const handleSwitchChain = (open = true) => {
    setChainItemSwitch(open)
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
        chain: chainItem?.name,
        contract: tokens?.address,
        symbol: tokens?.symbol,
        amount: tokensAmount,
        signature: data?.signature,
        payer: data?.payer,
        payeeId: payee?.id,
      }
      debugger
      if (widgetForm && widgetForm?.name) paymentOrderParams = { ...paymentOrderParams, ...widgetForm }
      if (debouncedPayNote) paymentOrderParams = Object.assign(paymentOrderParams, { message: debouncedPayNote })
      if (payChainId) paymentOrderParams = { ...paymentOrderParams, ...{ chainId: payChainId } }
      let res = await getPaymentOrderSvc(paymentOrderParams, 'post')
      if (res?.ok) {
        paymentSubmitedRef.current = false
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

  const walletClass = 'w-full py-3 text-lg rounded-lg shadow-sm bg-create-gradient-004'

  const accountStatus = ({ children = null, type = 0, actions = true } = {}) => (
    <section className={classNames('text-center pt-8')}>
      {paymentType == 3 && paymentQr ? (
        <header className="flex justify-center my-2">
          {qrLoading && <NmSpinInfinity absoluteYCenter customClass="scale-150 -mt-32" />}
          <div ref={qrRef} className="rounded-2xl overflow-hidden" />
        </header>
      ) : (
        children
      )}
      <ul className="py-4 font-medium flex flex-col gap-2">
        <li className="flex items-center justify-between rounded-lg h-12 px-4 bg-black/10 backdrop-blur">
          <span>Amount</span>
          <strong className="font-firasans">{`$ ${payInputValue}`}</strong>
        </li>
        <li className="group/item flex items-center justify-between rounded-lg h-12 px-4 bg-black/10 backdrop-blur">
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
          <strong className="font-firasans flex items-center">{`$ 0`}</strong>
        </li>
        <li className="flex items-center justify-between rounded-lg h-12 px-4 bg-black/10 backdrop-blur">
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
              <NmGlobalWallet disables={disabledChains} walletClass={walletClass} connectClass={walletClass} />
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
          <Box className="text-center">
            <ul className="pt-28 pb-20 font-firasans">
              <li className="relative text-7xl font-extrabold">
                <strong className="-mt-0.5 -ml-4 absolute top-1/2 -translate-y-1/2">$</strong>
                <input
                  disabled={payee?.amountType != 2}
                  value={payInputValue}
                  onChange={e => handlePayInputChange({ val: e.target.value })}
                  className="w-68 pl-7 text-7xl text-center bg-transparent border-gray-400/50 border-dashed border-0 border-b outline-0 focus:ring-0"
                />
              </li>
              <li className="text-lg sm:text-xl pt-1 truncate">
                {tokenPrice ? (
                  <p
                    className={classNames({
                      'animate__animated animate__fadeIn blur': tokenPriceLoading,
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
                      onClick={() => getTokenPrice()}
                    >
                      Try
                    </Button>
                  </Box>
                )}
              </li>
            </ul>
            {payee?.amountType == 2 && (
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
            )}
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
                onClick={() => {
                  if (payInputContinue) {
                    if (!widgetForm) return setPaymentType(2)

                    props?.onSubmitPay()
                    if (widgetForm?.name) {
                      setPaymentType(2)
                    }
                  }
                }}
              >
                Continue
              </NmBorderCounter>
            </footer>
          </Box>
        )
        break
      case 1:
        return (
          <Box>
            <header className="py-5">
              {tokenSearch ? (
                <Box className="relative animate__animated animate__fadeIn">
                  <NmIcon type="icon-search" className="text-1.5xl absolute left-0 bottom-1" />
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
                    Cancel
                  </span>
                </Box>
              ) : (
                <NmIcon type="icon-search" className="text-1.5xl cursor-pointer" onClick={() => setTokenSearch(true)} />
              )}
            </header>
            <ul className="scrollbar-hide overflow-y-auto max-h-84 flex flex-col gap-2">
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
                      setPaymentType(0)
                      handleTokenListReset()
                    }}
                  >
                    <Box className="relative">
                      <Avatar src={row?.logoURI || row?.icon_url} className="size-9 sm:size-10" />
                      <Avatar
                        src={chainItem?.icon || getActiveChain({ name: chainItem?.name })?.icon}
                        className={classNames('size-4 border absolute bottom-0 right-0', {
                          'bg-black': chainItem?.name
                            .split(' ')
                            .some(word => ['SOON', 'Arbitrum', 'BSC', 'Polygon', 'Aurora'].includes(word)),
                        })}
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
                              ...((getIncludesIgnoreCase(chainItem?.name, 'soon') && { chain: 'soon' }) ||
                                (getIncludesIgnoreCase(chainItem?.name, 'solana') && { chain: 'solana' }) ||
                                (chainItem?.type == 'EVM' && { chainId: payChainId })),
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
          </Box>
        )
        break
      case 2:
        return (
          <Box className="pt-16">
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
                  disabled={chainItem?.type != 'SVM'}
                  onClick={getPaymentQrGo}
                >
                  QR Code
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
          </Box>
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
                      ...((getIncludesIgnoreCase(chainItem?.name, 'soon') && { chain: 'soon' }) ||
                        (getIncludesIgnoreCase(chainItem?.name, 'solana') && { chain: 'solana' }) ||
                        (chainItem?.type == 'EVM' && { chainId })),
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
    <LandingCard
      customClass={classNames('!my-0 h-fit overflow-x-auto overflow-y-hidden', customClass)}
      tpls={{ style: `S00${payee?.theme || 0}` }}
    >
      <article className="relative pt-4 p-2 animate__animated animate__fadeIn" ref={payBoxRef}>
        <section className="flex justify-between items-center">
          <NmBorderCounter
            speed="smooth"
            customClass="rounded-md transition-all flex items-center gap-1.5 pl-1 pr-2 cursor-pointer"
            innerClass="border-1"
            onClick={() => payee?.chains?.length > 1 && handleSwitchChain(!chainItemSwitch)}
          >
            <Avatar
              src={chainItem?.icon || getActiveChain({ name: chainItem?.name })?.icon}
              className={classNames(
                'bg-transparent rounded-md p-1.5 size-9',
                chainItem?.disabled ? 'opacity-30' : 'cursor-pointer'
              )}
            />
            <span className="font-righteous pr-[0.2rem]">{chainItem?.name}</span>
            {payee?.chains?.length > 1 && <NmIcon type="icon-arrow_down" className="leading-0 mt-px" />}
          </NmBorderCounter>
          <NmBorderCounter
            speed="smooth"
            customClass="rounded-md transition-all flex items-center justify-center gap-1.5 py-[0.3rem] px-2 py-1 min-w-20 ml-3 cursor-pointer"
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
                  <NmIcon type="icon-arrow_down" className="leading-0 mt-px" />
                </>
              )
            ) : (
              'ESC'
            )}
          </NmBorderCounter>
        </section>
        <section className="flex flex-col min-h-100">{payContent(paymentType)}</section>

        {payee?.copyright && (
          <footer className="flex justify-end mt-12 opacity-70 hover:opacity-100 transition-all">
            <NextLink href={domains.master} target="_blank" rel="noopener noreferrer nofollow">
              <Image
                alt=""
                width={140}
                height={70}
                draggable={false}
                src={payee?.theme !== 5 ? logo.pro_mix_white : logo.pro_mix_black}
              />
            </NextLink>
          </footer>
        )}
        <SwipeableDrawer
          // container={lgScreen ? payBoxRef?.current : rootElement}
          disableBackdropTransition={!isiOS()}
          disableDiscovery={isiOS()}
          anchor="bottom"
          open={chainItemSwitch && payee?.chains?.length > 1}
          onClose={() => handleSwitchChain(false)}
          onOpen={() => handleSwitchChain}
          classes={{
            paper: classes.paper,
          }}
        >
          <LandingCard
            component="article"
            customClass="!my-0 min-h-80 lg:min-h-96 max-lg:rounded-b-none"
            tpls={{ style: `S00${payee?.theme || 0}` }}
          >
            <Tabs value={chainsTab} onChange={(e, val) => setChainsTab(val)} aria-label="Switch Chain Tab">
              {chainListTabs.map((row, index) => (
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
            <ul className="flex flex-wrap items-center p-4 pt-8 gap-8">
              {chainList.map((item, index) => {
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
                    className={classNames('relative', {
                      hidden: item?.['type'] !== chainListTabs[chainsTab]?.['type'],
                    })}
                    onClick={() => handleChainsSelect(index, 'default')}
                  >
                    <NmTooltip title={item?.disabled ? `${item?.name} Upcoming` : ''}>
                      {index == chainIndex && !item?.disabled ? (
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
          </LandingCard>
        </SwipeableDrawer>
      </article>
    </LandingCard>
  )
}

export default PaymentWidget
