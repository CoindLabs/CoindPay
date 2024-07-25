export const same = <T>(item1: T, item2: T): boolean => {
  const deepSame = <T>(item1: T, item2: T): boolean => {
    if (item1 === item2) return true

    if (item1 === undefined && item2 !== undefined) return false
    if (item1 !== undefined && item2 === undefined) return false

    if (item1 === null && item2 !== null) return false
    if (item1 !== null && item2 === null) return false

    const type1 = typeof item1
    const type2 = typeof item2

    if (type1 !== type2) return false

    // 1. basic type
    switch (type1) {
      case 'boolean':
        return item1 === item2
      case 'bigint':
        return `${item1}` === `${item2}`
      case 'number':
        return item1 === item2
      case 'string':
        return item1 === item2
      case 'function':
        return `${item1}` === `${item2}`
      case 'object':
        break
      default:
        console.error('can not compare value', item1, item2)
        throw Error('can not compare value')
    }

    // 2. Array
    const check1 = Object.prototype.toString.call(item1)
    const check2 = Object.prototype.toString.call(item2)

    if (check1 !== check2) return false

    if (check1 === '[object Array]') {
      const length1 = (item1 as any).length
      const length2 = (item2 as any).length
      if (length1 !== length2) return false
      for (let i = 0; i < length1; i++) {
        if (!deepSame((item1 as any)[i], (item2 as any)[i])) return false
      }
      return true
    }

    // 3. Object
    const keys1 = Object.keys(item1 as any)
    const keys2 = Object.keys(item2 as any)

    for (let i = 0; i < keys1.length; i++) {
      const key = keys1[i]
      if (!deepSame((item1 as any)[key], (item2 as any)[key])) return false
      const index = keys2.indexOf(key)
      if (index < 0) return false
      keys2.splice(index, 1)
    }
    return keys2.length === 0
  }

  return deepSame(item1, item2)

  // return JSON.stringify(item1) === JSON.stringify(item2);
}

// can be undefined
export const isSame = <T>(t1: T | undefined, t2: T | undefined, check?: (_1: T, _2: T) => boolean): boolean => {
  if (t1 === t2) return true
  if (t1 !== undefined) {
    if (t2 !== undefined) {
      return check ? check(t1, t2) : same(t1, t2)
    } else {
      return false
    }
  } else {
    if (t2 !== undefined) {
      return false
    } else {
      return true
    }
  }
}
// check string
export const isSameString = (s1: string | undefined, s2: string | undefined): boolean =>
  isSame(s1, s2, (s1, s2) => s1 === s2)
// check number
export const isSameNumber = (s1: number | undefined, s2: number | undefined): boolean =>
  isSame(s1, s2, (s1, s2) => s1 === s2)
// check boolean
export const isSameBoolean = (s1: boolean | undefined, s2: boolean | undefined): boolean =>
  isSame(s1, s2, (s1, s2) => s1 === s2)
