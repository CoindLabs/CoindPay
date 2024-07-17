import { FC, ReactNode, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Connect2ICProvider } from '@connect2ic/react'
import { ClientOnly } from '@/components/layout/client'

import config from '@/config'

import '@connect2ic/core/style.css'

const { title } = config

const ICP2Dynamic = dynamic(() => import('@connect2ic/react').then(module => module.Connect2ICProvider) as any, {
  ssr: false,
}) as typeof Connect2ICProvider

export const ICPContextProvider: FC<{ children: ReactNode }> = ({ children, ...props }) => {
  const [client, setClient] = useState(null)

  useEffect(() => {
    const loadClient = async () => {
      const { createClient } = await import('@connect2ic/core')
      const { PlugWallet, ICX, InternetIdentity, NFID, InfinityWallet, AstroX } = await import(
        '@connect2ic/core/providers'
      )
      const clientInstance = createClient({
        providers: [
          new InternetIdentity(),
          new PlugWallet(),
          new NFID(),
          new InfinityWallet(),
          (window as any).icx ? new ICX() : new AstroX(),
        ],
        globalProviderConfig: {
          dev: true,
          host: window.location.origin,
          appName: title,
          autoConnect: false,
        },
      })
      setClient(clientInstance)
    }

    loadClient().catch(error => console.error('Failed to load @connect2ic/core:', error))
  }, [])

  if (!client) return null
  return <ICP2Dynamic client={client}>{children}</ICP2Dynamic>
}
