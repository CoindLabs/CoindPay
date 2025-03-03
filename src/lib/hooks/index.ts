/*
 * Copyright (c) 2022 Next Labs. All rights reseved.
 * @fileoverview | 一些自建hooks库
 * @version 0.1 | 2022-07-18 // Initial version.
 * @Date: 2022-07-16 12:33:20
 * @Last Modified by: 0x3Anthony
 * @Last Modified time: 2025-03-03 21:36:21
 */
import { RefObject, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useMediaQuery, useTheme } from '@mui/material'
import { useAccount, useChains } from 'wagmi'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import { payChains } from '@/lib/chains'
import { useAuth } from '@/lib/hooks/auth'
import { getIncludesIgnoreCase } from '@/lib/utils'
import type { AppDispatch, AppState } from '@/lib/store'

import config from '@/config'

const { prefix } = config

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const useUserData = () => useAppSelector((state: any) => state.user)
export const usePayeeData = () => useAppSelector((state: any) => state.payee)

const BREAKPOINTS = {
  mobile: '(max-width: 767px)', // 小于 768px 是移动设备
  pad: '(min-width: 768px) and (max-width: 1023px)', // iPad 的断点
  padPro: '(min-width: 1024px) and (max-width: 1199px)', // iPad Pro 的断点
  desktop: '(min-width: 1200px)', // 桌面设备的断点
}

// Generic hook for media queries with memoization
const useDeviceQuery = query => {
  return useMediaQuery(query, {
    noSsr: true, // Prevents SSR mismatch
    defaultMatches:
      typeof window === 'undefined' // Handle server-side rendering
        ? false
        : window.matchMedia(query).matches,
  })
}

// Specific device hooks
export const useMobile = () => {
  return useDeviceQuery(BREAKPOINTS.mobile)
}

export const usePad = () => {
  return useDeviceQuery(BREAKPOINTS.pad)
}

export const usePadPro = () => {
  return useDeviceQuery(BREAKPOINTS.padPro)
}

export const useDesktop = () => {
  return useDeviceQuery(BREAKPOINTS.desktop)
}

export const useLocation = (type = 'host') => {
  const [locationKey, setLocationValue] = useState('')
  useEffect(() => {
    setLocationValue(typeof window !== 'undefined' && window.location[type] ? window.location[type] : '')
  }, [])
  return locationKey
}

export const useRouterStudio = () => sessionStorage.getItem(`${prefix}.bio.create`)

/**
 * 全局wallet连接时链类型及地址，仅适用于唯一钱包连接，如 NmWallet组件，不可用于多个链钱包共存的页面或模块
 */
export const useChainConnect = () => {
  const account = useAccount()
  const { solAddress } = useSolAccount()

  return useMemo(() => {
    if (solAddress) {
      return {
        address: solAddress,
        chainType: 'svm',
        svm: true,
      }
    } else if (account?.address) {
      return {
        address: account.address,
        chainType: 'evm',
        chainId: account.chainId,
        evm: true,
      }
    }
    return { address: null }
  }, [solAddress, account?.address, account.chainId])
}

/**
 * 全局wallet连接状态 包含多链
 * @returns boolean
 */
export const useGlobalWalletConnect = () => {
  const { address, chainType } = useChainConnect()

  const [globalWalletConnect, setWalletConnect] = useState<boolean>()
  useEffect(() => {
    return setWalletConnect(Boolean(address && chainType))
  }, [address, chainType])

  return globalWalletConnect
}

/**
 * EVM Wallet 连接状态
 * @returns
 */
export const useEVMWalletConnect = () => {
  const account = useAccount()
  const chains = useChains()
  const [evmWalletConnect, setEVMWalletConnect] = useState<boolean>()
  useEffect(() => {
    let status = Boolean(account?.address && chains.find(row => row.id == account?.chainId))
    return setEVMWalletConnect(status)
  }, [evmWalletConnect, account?.address, account?.chainId])
  return evmWalletConnect
}

/**
 * SVM 连接状态
 */
export const useSolAccount = () => {
  const { wallet, publicKey } = useWallet()

  return useMemo(() => {
    if (wallet && publicKey) {
      return {
        solAddress: publicKey.toBase58(),
      }
    }
    return {
      solAddress: '',
    }
  }, [wallet, publicKey])
}

export const useRouteTitlePath = () => {
  const router = useRouter()

  let paths =
    (router?.pathname && router?.pathname.split('/'))?.filter(
      row => row && !['[uuid]', '[id]', '[path]', '[address]'].includes(row)
    ) || []

  return paths
    ? `${paths
        .map(row => {
          if (row == 'pay') row = 'payments'
          return row.charAt(0).toUpperCase() + row.slice(1)
        })
        .join(' ')}`
    : ''
}

export const useTailWindFade = (option?: { open: boolean }) => {
  const [open, setOpen] = useState(option?.open || false)
  const [isEnter, setEnter] = useState(false)

  useEffect(() => {
    if (open) {
      setOpen(true)
      setTimeout(() => {
        setEnter(true)
      }, 16)
    } else {
      setEnter(false)
      setTimeout(() => {
        setOpen(false)
      }, 300)
    }
  }, [open])

  return {
    className: (common: string, leave: string, enter: string) => {
      return ['duration-300 transition-all z-[999]', common, isEnter ? enter : leave]
    },
    style: (common: React.CSSProperties, leave: React.CSSProperties = {}, enter: React.CSSProperties = {}) => {
      return Object.assign(common, isEnter ? enter : leave)
    },
    open,
    setOpen,
  }
}

function subscribe() {
  return () => {}
}

/**
 * Return a boolean indicating if the JS has been hydrated already.
 * When doing Server-Side Rendering, the result will always be false.
 * When doing Client-Side Rendering, the result will always be false on the
 * first render and true from then on. Even if a new component renders it will
 * always start with true.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

/**
 * 判断是否登录
 */
export function useLogin() {
  const { isLogin } = useAuth()
  const localUser = useUserData()
  return Boolean(localUser?.id) && isLogin
}

/**
 * payment chain switch
 */

export const useInitPayChainIndex = (chains = []) => {
  const router = useRouter()

  const findChainIndexByName = (chainName, chainList) => {
    if (!chainName) return -1
    return chainList.findIndex(chain => getIncludesIgnoreCase(chain.name, chainName))
  }

  const getInitialChainIndex = useMemo(() => {
    let chainName = router.query.chain

    if (Array.isArray(chainName)) {
      chainName = chainName[0] // 如果是数组，取第一个元素
    }

    chainName = chainName?.replace(/_/g, ' ').trim() // 替换下划线并去掉多余空格

    const index = findChainIndexByName(chainName, chains || payChains)

    return index !== -1 ? index : 0 // 如果找不到匹配的 chain，默认返回 0
  }, [router.query.chain, chains])

  return getInitialChainIndex
}
