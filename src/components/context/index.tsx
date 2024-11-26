import { ReactNode, FC, useState } from 'react'
import { Provider } from 'react-redux'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { WagmiProvider } from 'wagmi'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { SolanaContextProvider } from '@/components/context/chains/solana'
import { ICPContextProvider } from '@/components/context/chains/icp'
import { StudioContextProvider } from '@/components/context/studio'
import { UtilsContextProvider } from '@/components/context/utils'
import { SnackbarProvider } from '@/components/context/snackbar'
import { CacheRequestProvider } from '@/lib/api/cache'
import { wagmiConfig } from '@/lib/chains'
import { store } from '@/lib/store'

import config from '@/config'

const { prefix, themes } = config

let persistor = persistStore(store)

const cache = createCache({
  key: `${prefix}-style`,
  prepend: true,
})

export const rootElement = () => document.getElementById('__next')

const theme = createTheme({
  palette: {
    primary: {
      main: themes.primary,
    },
    success: {
      main: themes.success,
      contrastText: '#fff',
    },
    warning: {
      main: themes.warning,
      contrastText: '#fff',
    },
    error: {
      main: themes.error,
    },
    secondary: {
      main: themes.secondary,
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            color: themes.light,
            backgroundColor: themes.primary,
            ':hover': {
              opacity: 0.999,
              backgroundColor: themes.primary,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          textTransform: 'initial',
        },
      },
    },
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiModal: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiDrawer: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiSwipeableDrawer: {
      defaultProps: {
        container: rootElement,
      },
    },
    // ...
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1024,
      xl: 1536,
    },
  },
})

const queryClient = new QueryClient()

const walletConfig = getDefaultConfig(wagmiConfig)

export const GlobalContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CacheProvider value={cache}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <WagmiProvider config={walletConfig}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider
                showRecentTransactions
                theme={darkTheme({
                  ...darkTheme.accentColors.green,
                  accentColorForeground: '#fff',
                  overlayBlur: 'small',
                })}
                locale="en-US"
              >
                <SolanaContextProvider>
                  <ICPContextProvider>
                    <Provider store={store}>
                      <PersistGate loading={null} persistor={persistor}>
                        <UtilsContextProvider>
                          <CacheRequestProvider>
                            <StudioContextProvider>
                              <SnackbarProvider>{children}</SnackbarProvider>
                            </StudioContextProvider>
                          </CacheRequestProvider>
                        </UtilsContextProvider>
                      </PersistGate>
                    </Provider>
                  </ICPContextProvider>
                </SolanaContextProvider>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  )
}
