import { env } from '@/lib/types/env'
import config from '@/config'

const { host } = config

export const getDomain = () => {
  if (process.env.NEXT_PUBLIC_BRANCH) return process.env.NEXT_PUBLIC_BRANCH

  if (env.isDev) return 'dev'

  let hostname = (typeof window !== 'undefined' && window?.location?.hostname) || process.env.VERCEL_URL,
    hostname_first = hostname?.split(host)?.[0]

  if (!hostname_first) return 'master'
  if (hostname_first.endsWith('.')) return hostname_first.split('.')[0]
  return hostname_first
}
