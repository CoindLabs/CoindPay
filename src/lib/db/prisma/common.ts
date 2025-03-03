export const bigintFactory = data =>
  JSON.parse(JSON.stringify(data, (key, value) => (typeof value === 'bigint' ? Number(value) : value))) as any
