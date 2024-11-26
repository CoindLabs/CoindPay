import React from 'react'

export class TempContext {
  private _record: Map<string, any> = new Map()

  private _flush: Map<string, Function> = new Map()

  public contextCall(name: string, fn: Function) {
    if (this._record.get(name)) {
      const props = this._record.get(name)
      fn.apply(this, props)
    } else {
      this._flush.set(name, (...args) => {
        fn.apply(this, args)
      })
    }
  }

  public setContext(name: string, props: any[]) {
    this._record.set(name, props)
    if (this._flush.get(name)) {
      const fn = this._flush.get(name)
      fn.apply(null, props)
      this._flush.delete(name)
    }
  }
}

const context = new TempContext()

export const TempStore = React.createContext<TempContext>(null)

export const useTempContext = () => {
  return React.useContext(TempStore)
}

export const UtilsContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <TempStore.Provider value={context}>{children}</TempStore.Provider>
}
