import { ConnectType } from '@/lib/chains/identity'

export const readStorage = (key: string): string | undefined => {
  const r = localStorage.getItem(key)
  if (r == null) return undefined
  return r
}

export const writeStorage = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

export const BACKEND_TYPE = '__coindpay_backend__'

const LAST_CONNECT_TYPE = '__coindpay_last_connect_type__'
export const readLastConnectType = () => readStorage(LAST_CONNECT_TYPE) ?? ''
export const writeLastConnectType = (connectType: ConnectType | '' | 'email') =>
  writeStorage(LAST_CONNECT_TYPE, connectType)

const LAST_CONNECT_EMAIL = '__coindpay_last_connect_email__'
export const readLastConnectEmail = () => readStorage(LAST_CONNECT_EMAIL) ?? ''
export const writeLastConnectEmail = (email: string) => writeStorage(LAST_CONNECT_EMAIL, email)

const LAST_USED_TYPE = '__coindpay_last_used_type__'
export const readLastUsedType = () => readStorage(LAST_USED_TYPE) ?? ''
export const writeLastUsedType = (connectType: ConnectType | '' | 'email') => writeStorage(LAST_USED_TYPE, connectType)

export const UNITY_USER_TOKEN = '__unity_user_token__'

export const YUKU_USER_PERMISSIONS = '__coindpay_user_permissions__'
export const YUKU_EVENT_PERMISSION = 'EventCreator'

export const ICP_USD_HISTORY = '__icp_usd_history__'
export const readIcpUsdByDate = (date: string): number | undefined => {
  if (!readStorage(ICP_USD_HISTORY)) {
    return
  }
  try {
    return JSON.parse(readStorage(ICP_USD_HISTORY)!)[date]
  } catch (error) {
    console.debug('🚀 ~ readIcpUsdByDate ~ error:', error)
    return
  }
}
export const writeIcpUsdByDate = (date: string, price: number) => {
  const old = readStorage(ICP_USD_HISTORY)
  writeStorage(
    ICP_USD_HISTORY,
    old ? JSON.stringify({ ...JSON.parse(old), [date]: price }) : JSON.stringify({ [date]: price })
  )
}
