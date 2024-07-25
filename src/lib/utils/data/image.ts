export const image_to_base64 = (data: string) => {
  return 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(data)))
}
