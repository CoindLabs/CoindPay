import { ActorSubclass } from '@dfinity/agent'
import { IDL } from '@dfinity/candid'

export type ConnectType = 'ii' | 'plug' | 'me' | 'infinity' | 'nfid' | 'stoic'

export type ActorCreator = <T>(idlFactory: IDL.InterfaceFactory, canister_id: string) => Promise<ActorSubclass<T>>
export type IdentityEmail = {
  connectType: 'email'
  principal?: string
  hash?: string
  account?: string
  creator: ActorCreator
  requestWhitelist: (whitelist: string[]) => Promise<boolean>
  main_email: string
  user_id
}

export type ConnectedIdentity =
  | {
      connectType: ConnectType
      principal: string
      account: string
      creator: ActorCreator
      requestWhitelist: (whitelist: string[]) => Promise<boolean>
    }
  | IdentityEmail

export type ConnectedRecord = {
  connectType: ConnectType | 'email'
  principal?: string
  timestamp: number
}
