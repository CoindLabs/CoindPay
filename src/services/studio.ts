import { fetcher } from '@/lib/fetcher'

/**
 * 查询name对应的twitter数据
 * @param data
 * @returns
 */
export function getTwitterUserSvc(data) {
  return fetcher({
    url: 'api/dapp/twitter_user',
    params: data,
  })
}
