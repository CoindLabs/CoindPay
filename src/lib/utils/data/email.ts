const EMAIL_REGEX = /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/

export const isEmail = (email?: string): boolean => {
  if (email === undefined) return false
  return EMAIL_REGEX.test(email)
}
