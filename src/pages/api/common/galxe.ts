import type { NextApiRequest, NextApiResponse } from 'next'
import { fetcher } from '@/lib/fetcher'

export default async function Galxe(req: NextApiRequest, res: NextApiResponse) {
  if (!req?.query?.address) {
    return res.status(301).json({
      message: 'missing address parameter',
    })
  }
  const { address } = req.query

  try {
    const galxeData = await fetcher({
      baseURL: 'https://graphigo.prd.galaxy.eco/query',
      method: 'post',
      data: {
        query: `query userCredentials {
          addressInfo(address: "${address}") {
            id
            avatar
            username
            eligibleCredentials(first: 1000, after: "") {
              list {
                id
                name
              }
            }
          }
        }`,
        variables: { address },
      },
    })
    res.status(200).json({
      ok: true,
      data: galxeData,
    })
  } catch (error) {
    res.status(500).json({
      message: 'request status error:' + error,
    })
  }
}
