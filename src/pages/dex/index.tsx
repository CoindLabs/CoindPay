import type { NextPage } from 'next'
import { useMemo, useState } from 'react'
import { formControlClasses, inputBaseClasses, inputClasses, tabsClasses } from '@mui/material'
import { Breakpoint, useTheme } from '@mui/material/styles'
import { WidgetConfig, WidgetSkeleton } from '@lifi/widget'
import StudioLayout from '@/components/layout/studio'
import { LiFiWidgetDynamic } from '@/components/dapp/lifi'
import { useStudioContext } from '@/components/context/studio'

import config from '@/config'

const { title } = config

const Exchange: NextPage = () => {
  const theme = useTheme()
  const { setAccountCardShow } = useStudioContext()

  const widgetConfig: WidgetConfig = useMemo((): WidgetConfig => {
    return {
      integrator: title,
      appearance: 'light',
      insurance: true,
      variant: 'wide',
      subvariant: 'split',
      hiddenUI: ['appearance', 'language', 'poweredBy', 'walletMenu'],
      theme: {
        container: {
          minWidth: '55%',
          border: `1px solid rgb(234, 234, 234)`,
          borderRadius: '16px',
          [theme.breakpoints.between('sm', 'lg')]: {
            minWidth: '36rem',
          },
        },
        shape: {
          borderRadius: 12,
          borderRadiusSecondary: 100,
        },
        typography: {
          fontFamily: theme.typography.fontFamily,
        },
        palette: {
          primary: {
            main: config.themes.accent,
          },
          background: {
            default: '#fff',
            paper: '#f8f8fa',
          },
        },
        components: {
          MuiInputCard: {
            styleOverrides: {
              root: {
                [`.${inputBaseClasses.input}`]: {
                  backgroundColor: '#f8f8fa',
                },
              },
            },
          },
          MuiCard: {
            // @ts-ignore
            defaultProps: { variant: 'filled' },
          },
          // Used only for 'split' subvariant and can be safely removed if not used
          MuiTabs: {
            styleOverrides: {
              root: {
                backgroundColor: '#f8f8fa',
                [`.${tabsClasses.indicator}`]: {
                  backgroundColor: '#ffffff',
                },
              },
            },
          },
        },
      },
      walletConfig: {
        async onConnect() {
          setAccountCardShow(true)
        },
      },
    }
  }, [theme.breakpoints, theme.typography.fontFamily])

  return (
    <StudioLayout>
      <LiFiWidgetDynamic config={widgetConfig} integrator={title} />
    </StudioLayout>
  )
}

export default Exchange
