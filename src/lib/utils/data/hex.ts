export const hex2array = (hex: string): number[] => {
  if (hex.startsWith('0x')) hex = hex.slice(2)
  if (hex.length === 0) return []
  if (hex.length % 2 !== 0) throw new Error('Invalid hex text')
  const value: number[] = []
  for (let i = 0; i < hex.length; i += 2) value.push(parseInt(hex.slice(i, i + 2), 16))
  return value
}

export const array2hex = (value: number[]): string => {
  return value
    .map(v => {
      if (v < 0 || 255 < v) throw new Error('number must between 0~255')
      return v.toString(16).padStart(2, '0')
    })
    .join('')
}
