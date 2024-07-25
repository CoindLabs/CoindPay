import { getCrc32 } from '@dfinity/principal/lib/esm/utils/getCrc'
import { sha224 } from '@dfinity/principal/lib/esm/utils/sha224'
import { string2array } from '../data/arrays'
import { array2hex, hex2array } from '../data/hex'
import { string2principal } from '../types/principal'

export const principal2account = (principal: string, subaccount?: number | Uint8Array | number[]): string => {
  return array2hex(principal2account_array(principal, subaccount))
}

export const principal2account_array = (principal: string, subaccount?: number | Uint8Array | number[]): number[] => {
  if (typeof subaccount === 'number') {
    subaccount = [(subaccount >> 24) & 0xff, (subaccount >> 16) & 0xff, (subaccount >> 8) & 0xff, subaccount & 0xff]
  }
  if (subaccount === undefined) subaccount = []
  while (subaccount.length < 32) subaccount = [0, ...subaccount]
  if (subaccount.length !== 32) throw new Error(`wrong subaccount: ${subaccount}`)

  const buffer: number[] = [
    ...string2array('\x0Aaccount-id'),
    ...string2principal(principal).toUint8Array(),
    ...subaccount,
  ]

  const hash = sha224(new Uint8Array(buffer))
  const checksum = getCrc32(hash)

  const result = [
    (checksum >> 24) & 0xff,
    (checksum >> 16) & 0xff,
    (checksum >> 8) & 0xff,
    (checksum >> 0) & 0xff,
    ...hash,
  ]

  return result
}

export const isAccountHex = (text: string | undefined): boolean => {
  if (!text) return false
  if (text.length !== 64) return false
  try {
    return hex2array(text).length === 32
  } catch {
    //
  }
  return false
}
