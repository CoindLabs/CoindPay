export type Option<T> = [] | [T]

export const unwrapOption = <T>(v: [] | [T]): T | undefined => (v.length ? v[0] : undefined)

export const unwrapOptionMap = <T, R>(v: [] | [T], map: (t: T) => R): R | undefined =>
  v.length ? map(v[0]) : undefined

export const wrapOption = <T>(v?: T): [] | [T] => (v !== undefined ? [v] : [])

export const wrapOptionMap = <T, R>(v: T | undefined, map: (t: T) => R): [] | [R] => (v !== undefined ? [map(v)] : [])
