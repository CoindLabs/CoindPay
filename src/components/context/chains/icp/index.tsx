import { FC, ReactNode, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Connect2ICProvider } from '@connect2ic/react'
import { ICPConnectProvider } from '@/components/context/chains/icp/connect'
import { CustomPlugWallet } from '@/lib/utils/providers/plug'
// import { CustomInternetIdentity } from '@/lib/utils/providers/ii'
// import { CustomNFID } from '@/lib/utils/providers/nfid'

import '@connect2ic/core/style.css'

import config from '@/config'

const { title } = config

const ICP2Dynamic = dynamic(() => import('@connect2ic/react').then(module => module.Connect2ICProvider) as any, {
  ssr: false,
}) as typeof Connect2ICProvider

export const ICPContextProvider: FC<{ children: ReactNode }> = ({ children, ...props }) => {
  const [client, setClient] = useState(null)

  useEffect(() => {
    const loadClient = async () => {
      const { createClient } = await import('@connect2ic/core')
      const { PlugWallet, InternetIdentity, ICX, NFID, InfinityWallet, AstroX } = await import(
        '@connect2ic/core/providers'
      )
      const clientInstance = createClient({
        providers: [
          new InternetIdentity(),
          new NFID(),
          // new CustomInternetIdentity(),
          // new CustomNFID(),
          new CustomPlugWallet(),
          new InfinityWallet(),
          (window as any).icx
            ? new ICX({
                delegationModes: ['domain', 'global'],
                dev: false,
              })
            : new AstroX({
                delegationModes: ['domain', 'global'],
                dev: false,
              }),
        ],
        globalProviderConfig: {
          dev: false,
          host: window.location.origin,
          appName: title,
          autoConnect: true,
        },
      })
      setClient(clientInstance)
    }

    loadClient().catch(error => console.error('Failed to load @connect2ic/core:', error))
  }, [])

  if (!client) return null
  return (
    <ICP2Dynamic client={client}>
      <ICPConnectProvider>{children}</ICPConnectProvider>
    </ICP2Dynamic>
  )
}
