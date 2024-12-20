import { env } from '@/lib/types/env'
import { getDomain } from './domain'

export const Mainnet = env?.isProd || ['app', 'soon'].includes(getDomain())
