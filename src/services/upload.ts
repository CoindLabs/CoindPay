import { fetcher } from '@/lib/fetcher'

export function getFileSignSvc(data, method = 'post') {
  return fetcher({
    method,
    url: 'api/upload/sign',
    data,
  })
}

export function getFileUploadSvc(data, method = 'post') {
  return fetcher({
    method,
    url: 'api/upload',
    data,
  })
}
