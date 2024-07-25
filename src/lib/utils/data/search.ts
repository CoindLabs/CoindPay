export const parseLowerCaseSearch = (search: string): string => {
  if (!search) return search
  const s = search.trim().toLowerCase()
  if (!s) return search
  return s
}
