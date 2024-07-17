import React, { createContext, useContext, useState, ReactNode } from 'react'
import NmSnackbar from '@/components/nm-snackbar'

type Option = {
  snackbar?: any
  anchorOrigin?: any
  className?: string
}

type SnackbarContextType = {
  showSnackbar: (options?: any) => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined)

const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbarProps, setSnackbarProps] = useState<Option | undefined>(undefined)
  const showSnackbar = (options?: Option) => {
    setSnackbarProps(options)
  }

  const closeSnackbar = () => {
    setSnackbarProps({
      snackbar: {
        open: false,
      },
    })
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbarProps && snackbarProps?.snackbar?.text && <NmSnackbar {...snackbarProps} close={closeSnackbar} />}
    </SnackbarContext.Provider>
  )
}

const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}

export { SnackbarProvider, useSnackbar }
