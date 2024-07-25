import { ConnectError, CreateActorError, DisconnectError, InitError } from '@connect2ic/core'
import { Actor, HttpAgent } from '@dfinity/agent'
import { AuthClient } from '@dfinity/auth-client'
import { IDL } from '@dfinity/candid'
import { err, ok } from 'neverthrow'

import config from '@/config'

const { domains } = config

export const getNFIDFrame = (): string => {
  const width = window.innerWidth
  const height = window.innerHeight
  const w = 768
  const h = 630
  const left = Math.floor((width - w) / 2)
  const top = Math.floor((height - h) / 2)
  return `toolbar=0,location=0,menubar=0,width=${w},height=${h},left=${left},top=${top}`
}

type NFIDConfig = {
  whitelist: Array<string>
  appName: string
  host: string
  providerUrl: string
  dev: boolean
  derivationOrigin?: string
  windowOpenerFeatures?: string
}

export class CustomNFID {
  public meta = {
    features: [],
    icon: {
      light: `${domains.cdn}/static/social/nfid.min.svg`,
      dark: `${domains.cdn}/static/social/nfid.min.svg`,
    },
    id: 'nfid',
    name: 'NFID',
  }

  #config: NFIDConfig
  #identity?: any
  #principal?: string
  #client?: any

  get identity() {
    return this.#identity
  }

  get principal() {
    return this.#principal
  }

  get client() {
    return this.#client
  }

  constructor(
    userConfig: {
      whitelist?: string[]
      appName?: string
      host?: string
      providerUrl?: string
      dev?: boolean
      derivationOrigin?: string
      windowOpenerFeatures?: string
    } = {}
  ) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      providerUrl: 'https://nfid.one',
      appName: 'my-ic-app',
      dev: true,
      ...userConfig,
    }
  }

  set config(config: NFIDConfig) {
    this.#config = { ...this.#config, ...config }
  }

  get config() {
    return this.#config
  }

  async init() {
    try {
      // TODO: pass in config or not?
      this.#client = await AuthClient.create()
      const isConnected = await this.isConnected()
      if (isConnected) {
        this.#identity = this.#client.getIdentity()
        this.#principal = this.#identity.getPrincipal().toString()
      }
      return ok({ isConnected })
    } catch (e) {
      console.error(e)
      return err({ kind: InitError.InitFailed })
    }
  }

  async isConnected() {
    try {
      if (!this.#client) {
        return false
      }
      return await this.#client.isAuthenticated()
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory) {
    try {
      // TODO: allow passing identity?
      const agent = new HttpAgent({
        ...this.#config,
        identity: this.#identity,
      })

      if (this.#config.dev) {
        // Fetch root key for certificate validation during development
        const res = await agent
          .fetchRootKey()
          .then(() => ok(true))
          .catch(() => err({ kind: CreateActorError.FetchRootKeyFailed }))
        if (res.isErr()) {
          return res
        }
      }
      // TODO: add actorOptions?
      const actor = Actor.createActor<Service>(idlFactory, {
        agent,
        canisterId,
      })
      return ok(actor)
    } catch (e) {
      console.error(e)
      return err({ kind: CreateActorError.CreateActorFailed })
    }
  }

  async connect() {
    try {
      await new Promise((resolve, reject) => {
        this.#client.login({
          // TODO: local
          identityProvider: this.#config.providerUrl + `/authenticate/?applicationName=${this.#config.appName}`,
          onSuccess: resolve,
          onError: reject,
          windowOpenerFeatures: this.#config.windowOpenerFeatures
            ? this.#config.windowOpenerFeatures
            : window.innerWidth < 768
              ? undefined
              : getNFIDFrame(),
          derivationOrigin: this.#config.derivationOrigin,
        })
      })
      const identity = this.#client.getIdentity()
      const principal = identity.getPrincipal().toString()
      // TODO: why is this check here?
      if (identity) {
        this.#identity = identity
        this.#principal = principal
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
      await this.#client.logout()
      return ok(true)
    } catch (e) {
      console.error(e)
      return err({ kind: DisconnectError.DisconnectFailed })
    }
  }
}
