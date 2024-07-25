import React, { FC, ReactNode, createContext, useContext, useEffect, useState, useMemo } from 'react'

export interface ConnectContextState {
  icpState: any
}

export const ConnectContext = createContext<ConnectContextState>({} as ConnectContextState)

export function useICPConnect(): ConnectContextState {
  return useContext(ConnectContext)
}

export const ICPConnectProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [icpState, setIcpState] = useState(null)

  useEffect(() => {
    const loadConnectData = async () => {
      const { useBalance, useWallet, useConnect, useDialog } = await import('@connect2ic/react')
      setIcpState({ useWallet, useBalance, useConnect, useDialog })
    }

    loadConnectData().catch(error => console.error('Failed to load @connect2ic/react:', error))
  }, [])

  return <ConnectContext.Provider value={{ icpState }}>{children}</ConnectContext.Provider>
}
