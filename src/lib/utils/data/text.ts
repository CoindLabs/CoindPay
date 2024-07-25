export const shrinkText = (text: string | undefined, prefix = 5, suffix = 5): string | undefined => {
  if (!text) return text
  const max_length = prefix + 3 + suffix
  if (text.length <= max_length) return text
  const prefix_text = prefix === 0 ? '' : text.slice(0, prefix)

  const suffix_text = suffix === 0 ? '' : text.slice(-suffix)
  return `${prefix_text}...${suffix_text}`
}

export const shrinkPrincipal = (text: string | undefined): string | undefined => shrinkText(text, 5, 3)

export const shrinkAccount = (text: string | undefined): string | undefined => shrinkText(text, 4, 4)
