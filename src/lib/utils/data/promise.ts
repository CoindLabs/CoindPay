export const alreadyMessaged = (d: undefined | false | any): any => {
  if (d === undefined || d === false) throw new Error(`${d}`)
  return d
}

export const throwUndefined = <T>(d: undefined | T): T => {
  if (d === undefined) throw new Error(`${d}`)
  return d
}
