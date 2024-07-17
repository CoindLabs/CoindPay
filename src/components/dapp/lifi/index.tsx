import { LiFiWidget } from '@lifi/widget'
import dynamic from 'next/dynamic'
import NmSpinInfinity from '@/components/nm-spin/infinity'

export const LiFiWidgetDynamic = dynamic(() => import('@lifi/widget').then(module => module.LiFiWidget) as any, {
  ssr: false,
  loading: () => <NmSpinInfinity absoluteCenter customClass="top-[40%] loading-lg scale-150" />,
}) as typeof LiFiWidget
