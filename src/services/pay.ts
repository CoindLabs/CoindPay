import { fetcher } from '@/lib/fetcher'

export function getPayeeAccountSvc(data, method = 'get') {
  let query = method == 'get' ? { params: data } : { data }
  return fetcher({
    method,
    url: 'api/payment/payee',
    ...query,
  })
}

export function getPaymentOrderSvc(data, method = 'get') {
  let query = method == 'get' ? { params: data } : { data }
  return fetcher({
    method,
    url: 'api/payment/landing',
    ...query,
  })
}
