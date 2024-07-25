import {
  BalanceError,
  ConnectError,
  CreateActorError,
  DisconnectError,
  InitError,
  TransferError,
} from '@connect2ic/core'
import { IConnector, IWalletConnector } from '@connect2ic/core'
import { ActorSubclass, Agent } from '@dfinity/agent'
import { IDL } from '@dfinity/candid'
import { Principal } from '@dfinity/principal'
import { err, ok } from 'neverthrow'
import { readLastConnectType, writeLastConnectType } from '@/lib/utils/storage'

import config from '@/config'

const { domains } = config

type Plug = {
  createActor: <T>(args: { canisterId: string; interfaceFactory: IDL.InterfaceFactory }) => Promise<ActorSubclass<T>>
  agent: Agent
  createAgent: (options: { host: string; whitelist: Array<string> }) => Promise<Agent>
  getPrincipal: () => Promise<Principal>
  isConnected: () => Promise<boolean>
  disconnect: () => Promise<void>
  requestConnect: (config: { whitelist?: string[]; host?: string }) => Promise<boolean>
  accountId: string
  requestTransfer: (args: {
    to: string
    amount: number
    opts?: {
      fee?: number
      memo?: string
      from_subaccount?: number
      created_at_time?: {
        timestamp_nanos: number
      }
    }
  }) => Promise<{
    height: number
  }>
  requestBalance: () => Promise<
    Array<{
      amount: number
      canisterId: string
      decimals: number
      image?: string
      name: string
      symbol: string
    }>
  >
  getManagementCanister: () => Promise<ActorSubclass | undefined>
}

export class CustomPlugWallet implements IConnector, IWalletConnector {
  public meta = {
    features: ['wallet'],
    icon: {
      light: `${domains.cdn}/static/social/plug-light.min.svg`,
      dark: `${domains.cdn}/static/social/plug-dark.min.svg`,
    },
    id: 'plug',
    name: 'Plug Wallet',
  }

  #config: {
    whitelist: Array<string>
    host: string
    dev: boolean
    onConnectionUpdate: () => void
  }
  #identity?: any
  #principal?: string
  #client?: any
  #ic?: Plug
  #wallet?: {
    principal: string
    accountId: string
  }

  onUpdate = () => {
    // const { agent, principal, accountId } = window.ic.plug.sessionManager.sessionData;
    // agent.getPrincipal().then((principal: Principal) => {});
    if (readLastConnectType() === 'plug') {
      writeLastConnectType('')
    }
  }

  get identity() {
    return this.#identity
  }

  get wallets() {
    return this.#wallet ? [this.#wallet] : []
  }

  get principal() {
    return this.#principal
  }

  get client() {
    return this.#client
  }

  get ic() {
    return this.#ic
  }

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      dev: true,
      onConnectionUpdate: () => {
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const { agent, principal, accountId } = window.ic.plug.sessionManager.sessionData
        // TO DO: recreate actors
        // TO DO: handle account switching

        // difference
        this.onUpdate()
      },
      ...userConfig,
    }
    this.#ic = window.ic?.plug
  }

  set config(config) {
    this.#config = { ...this.#config, ...config }
  }

  get config() {
    return this.#config
  }

  async init() {
    // TO DO: handle account switching
    try {
      if (!this.#ic) {
        return err({ kind: InitError.NotInstalled })
      }
      // difference
      ;(this.#ic as any).sessionManager.onConnectionUpdate = this.onUpdate
      const status = await this.status()
      // difference
      if (status !== 'disconnected' && status !== 'locked') {
        await this.#ic.createAgent({
          host: this.#config.host,
          whitelist: this.#config.whitelist,
        })
      }
      if (status === 'connected') {
        // Never finishes if locked
        // difference
        this.#principal = (this.#ic as any).sessionManager.sessionData.principalId as string
        // this.#principal = (await this.#ic.getPrincipal()).toString()
        this.#wallet = {
          principal: this.#principal,
          // difference
          accountId: (this.#ic as any).sessionManager.sessionData.accountId,
          // accountId: this.#ic.accountId,
        }
      }
      return ok({ isConnected: false })
    } catch (e) {
      console.error(e)
      return err({ kind: InitError.InitFailed })
    }
  }

  async status() {
    if (!this.#ic) {
      return 'disconnected'
    }
    // difference
    if (readLastConnectType() !== 'plug') {
      if (!(this.#ic as any).sessionManager.sessionData) return 'disconnected'
    }
    try {
      // difference
      let returned = false
      return await Promise.race([
        this.#ic.isConnected().then(connected => {
          // difference
          if (returned && connected) location.reload()
          return connected ? 'connected' : 'disconnected'
        }),
        new Promise(resolve =>
          setTimeout(() => {
            // difference
            returned = true
            resolve('locked')
          }, 2000)
        ),
      ])
    } catch (e) {
      // difference
      this.#ic.disconnect()
      return 'disconnected'
    }
  }

  async isConnected() {
    try {
      if (!this.#ic) return false
      // difference
      if (!(this.#ic as any).sessionManager.sessionData) return false
      return await this.#ic.isConnected()
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory) {
    if (!this.#ic) {
      return err({ kind: CreateActorError.NotInitialized })
    }
    try {
      // Fetch root key for certificate validation during development
      if (this.#config.dev) {
        const res = await this.#ic.agent
          .fetchRootKey()
          .then(() => ok(true))
          .catch(() => err({ kind: CreateActorError.FetchRootKeyFailed }))
        if (res.isErr()) {
          return res
        }
      }
      const actor = await this.#ic.createActor<Service>({
        canisterId,
        interfaceFactory: idlFactory,
      })
      return ok(actor)
    } catch (e) {
      console.error(e)
      return err({ kind: CreateActorError.CreateActorFailed })
    }
  }

  async connect() {
    try {
      if (!this.#ic) {
        window.open('https://plugwallet.ooo/', '_blank')
        return err({ kind: ConnectError.NotInstalled })
      }
      await this.#ic.requestConnect(this.#config)
      this.#principal = (await this.#ic.getPrincipal()).toString()
      if (this.#principal) {
        this.#wallet = {
          principal: this.#principal,
          accountId: this.#ic.accountId,
        }
        return ok(true)
      }
      return ok(true)
    } catch (e) {
      console.error(e)
      return err({ kind: ConnectError.ConnectFailed })
    }
  }

  async disconnect() {
    try {
      if (!this.#ic) {
        return err({ kind: DisconnectError.NotInitialized })
      }
      // TO DO: should be awaited but never finishes, tell Plug to fix
      await this.#ic.disconnect()
      return ok(true)
    } catch (e) {
      console.error(e)
      return err({ kind: DisconnectError.DisconnectFailed })
    }
  }

  async requestTransfer(opts: {
    amount: number
    to: string
    symbol?: string
    standard?: string
    decimals?: number
    fee?: number
    memo?: bigint
    createdAtTime?: Date
    fromSubAccount?: number
  }) {
    const {
      to,
      amount,
      standard = 'ICP',
      symbol = 'ICP',
      decimals = 8,
      fee = 0,
      memo = BigInt(0),
      createdAtTime = new Date(),
      fromSubAccount = 0,
    } = opts
    try {
      const result = await this.#ic?.requestTransfer({
        to,
        amount: amount * 100000000,
      })

      switch (!!result) {
        case true:
          return ok({ height: result!.height })
        default:
          // TO DO: ?
          return err({ kind: TransferError.TransferFailed })
      }
    } catch (e) {
      console.error(e)
      return err({ kind: TransferError.TransferFailed })
    }
  }

  async queryBalance() {
    try {
      if (!this.#ic) {
        return err({ kind: BalanceError.NotInitialized })
      }
      const assets = await this.#ic.requestBalance()
      return ok(assets)
    } catch (e) {
      console.error(e)
      return err({ kind: BalanceError.QueryBalanceFailed })
    }
  }

  // TO DO:

  // signMessage({ message }) {
  //   return this.#ic?.signMessage({message})
  // }

  // async getManagementCanister() {
  //   return this.#ic?.getManagementCanister()
  // }

  // batchTransactions(...args) {
  //   return this.#ic?.batchTransactions(...args)
  // }
}
