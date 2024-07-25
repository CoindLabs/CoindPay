import { Principal } from '@dfinity/principal'

export const isPrincipalText = (text: string | undefined): boolean => {
  if (!text) return false
  try {
    Principal.fromText(text)
    return true
  } catch (e) {
    return false
  }
}

export const isCanisterIdText = (text: string | undefined): boolean => {
  if (!text) return false
  if (text.length !== 27) return false
  return isPrincipalText(text)
}
