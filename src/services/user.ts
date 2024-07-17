// https://nextjs.org/docs/basic-features/data-fetching/client-side
import { fetcher } from '@/lib/fetcher'

export function getUserAddressSvc(data) {
  return fetcher({
    url: 'api/user/address',
    method: 'post',
    data,
  })
}

export function getUserAccountSvc(data) {
  return fetcher({
    url: 'api/user/account',
    method: 'put',
    data,
  })
}

export function getUserStatisticsSvc() {
  return fetcher({
    url: 'api/user/statistics',
  })
}
