/*
 * Copyright (c) 2022 Next Labs. All rights reseved.
 * @fileoverview | 一些自建hooks库
 * @version 0.1 | 2022-07-18 // Initial version.
 * @Date: 2022-07-16 12:33:20
 * @Last Modified by: 0x3Anthony
 * @Last Modified time: 2024-07-16 18:50:30
 */
import { RefObject, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from '@mui/material'
import { useAccount, useChains } from 'wagmi'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import { Network } from 'alchemy-sdk'
import { getSpaceIDReverseNameSvc } from '@/services/common'
import { icpInfo } from '@/store/slice/icp'
import { chainIdToNetWork } from '@/lib/chains'
import type { AppDispatch, AppState } from '../store'

import config from '@/config'

const { prefix } = config

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const useUserData = () => useAppSelector((state: any) => state.user)
export const useStudioData = () => useAppSelector((state: any) => state.studio)
export const useStudioServerData = () => useAppSelector((state: any) => state.studioServer)

export const useMobile = () => useMediaQuery('(max-width:640px)')

export const useLocation = (type = 'host') => {
  const [locationKey, setLocationValue] = useState('')
  useEffect(() => {
    setLocationValue(typeof window !== 'undefined' && window.location[type] ? window.location[type] : '')
  }, [])
  return locationKey
}

export const useRouterStudio = () => sessionStorage.getItem(`${prefix}.bio.create`)

/**
 * Dapp内置已支持的Network
 * @returns { networkType,scan }
 */
export const useNetworkType = (id?: number) => {
  const chains = useChains()
  const { sol } = useChainConnect()
  const { chain, chainId } = useAccount()
  let networks = useMemo(() => {
    if (sol) {
      return {
        networkType: 'sol',
        scan: 'https://explorer.solana.com',
      }
    } else if (id) {
      const chainValue = chains.find(item => item.id == id)
      return {
        networkType: chainIdToNetWork(chainId) || Network.ETH_MAINNET,
        scan:
          chainValue?.blockExplorers?.default?.url ||
          chainValue?.blockExplorers?.etherscan?.url ||
          'https://etherscan.io',
      }
    } else {
      return {
        networkType: chainIdToNetWork(chainId) || Network.ETH_MAINNET,
        scan: chain?.blockExplorers?.default?.url || chain?.blockExplorers?.etherscan?.url || 'https://etherscan.io',
      }
    }
  }, [chainId])
  return networks
}

/**
 * 全局wallet连接时链类型及地址，仅适用于唯一钱包连接，如 NmWallet组件，不可用于多个链钱包共存的页面或模块
 */
export const useChainConnect = () => {
  const account = useAccount()
  const { solAddress } = useSolAccount()
  const icpData = useSelector(icpInfo)
  if (account?.address) {
    return {
      address: account.address,
      chainType: 'evm',
      chainId: account.chainId,
      evm: true,
    }
  } else if (solAddress) {
    return {
      address: solAddress,
      chainType: 'sol',
      sol: true,
    }
  } else if (icpData?.accountId) {
    return {
      address: icpData.accountId,
      chainType: 'icp',
      icp: true,
    }
  }
  return { address: null }
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
  }, [globalWalletConnect, address, chainType])
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
 * Solana 连接状态
 */
export const useSolAccount = () => {
  const { wallet, publicKey, disconnect } = useWallet()
  if (wallet && publicKey) {
    return {
      solDisconnect: disconnect,
      solAddress: publicKey.toBase58(),
    }
  } else {
    return {
      solAddress: '',
    }
  }
}

/**
 * 查询bnb账户
 * @param {address}
 * @returns bnb account
 */
export const useBNBName = ({ address }) => {
  const [bnbName, setBNBName] = useState(null)
  useEffect(() => {
    ;(async () => {
      if (!address) return
      let res = await getSpaceIDReverseNameSvc({ address })
      if (res?.ok && res?.name) {
        setBNBName(res?.name)
      }
    })()
  }, [address])
  return bnbName
}

function syncScroller(targets, tabIndex) {
  let nodes = Array.prototype.filter.call(targets, item => item instanceof HTMLElement)

  let max = nodes.length
  if (!max || max === 1 || tabIndex !== 2) return
  let sign = 0 // 用于标注

  function event() {
    if (!sign) {
      // 标注为 0 时 表示滚动起源
      sign = max - 1
      // 找到当前滚动index
      const container = this.querySelector('#scrollBlocks')?.children?.[1]

      let currentIndex = 0
      if (container?.children) {
        ;[...container?.children].forEach((sectionRef, index) => {
          const { offsetTop, clientHeight } = sectionRef
          if (this.scrollTop >= offsetTop - clientHeight * (1 / 5)) {
            currentIndex = index
          }
        })
      }

      for (let node of nodes) {
        // 同步所有除自己以外节点 (todo  先屏蔽掉preview的同步滚动 屏蔽编辑页面)
        if (
          node !== this &&
          node.id === 'preview' &&
          !this.querySelector('#scrollBlocks')?.classList?.contains('hidden')
        ) {
          node.scrollTop =
            node.querySelector('#previewSection')?.children?.[currentIndex === 0 ? 0 : currentIndex + 1]?.offsetTop -
            node.offsetTop
        }
      }
    } else --sign // 其他节点滚动时 标注减一
  }

  nodes.forEach(ele => {
    ele.addEventListener('scroll', event)
  })

  return () => {
    nodes.forEach(ele => {
      ele.removeEventListener('scroll', event)
    })
  }
}

export const useSyncScrollerEffect = (refs, tabIndex) => {
  const targets = refs.map(item => item.current ?? item)

  useEffect(() => {
    // @ts-ignore
    return syncScroller(targets, tabIndex)
  }, [targets])
}

export const useRouteEndPath = () => {
  const router = useRouter()

  let paths = (router?.pathname && router?.pathname.split('/')) || [],
    end = paths[paths.length - 1]

  return end && !end.includes('[uuid]') ? `${end.replace(end[0], end[0].toUpperCase())}` : ''
}

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false }: Args
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const frozen = entry?.isIntersecting && freezeOnceVisible

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
  }

  useEffect(() => {
    const node = elementRef?.current // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen])

  return entry
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
export function useIsLoggedIn() {
  const localUser = useUserData()
  return Boolean(localUser?.id)
}
