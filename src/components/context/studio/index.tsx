import { Dispatch, HTMLAttributes, SetStateAction, createContext, useContext, useState } from 'react'
export interface StudioProvider {
  shareCardShow?: number
  setShareCardShow?: Dispatch<SetStateAction<number>>
  accountCardShow?: boolean
  setAccountCardShow?: Dispatch<SetStateAction<boolean>>
  chainsExpand?: boolean
  setChainsExpand?: Dispatch<SetStateAction<boolean>>
}

export interface IStudioProviderProps extends HTMLAttributes<HTMLDivElement> {}

export const StudioContext = createContext<StudioProvider>({} as StudioProvider)

export const StudioContextProvider = (props: IStudioProviderProps) => {
  const [shareCardShow, setShareCardShow] = useState(0)
  const [accountCardShow, setAccountCardShow] = useState(false)
  const [chainsExpand, setChainsExpand] = useState(false)

  return (
    <StudioContext.Provider
      value={{
        shareCardShow,
        setShareCardShow,
        accountCardShow,
        setAccountCardShow,
        chainsExpand,
        setChainsExpand,
      }}
    >
      {props.children}
    </StudioContext.Provider>
  )
}
export const useStudioContext = () => useContext(StudioContext)
