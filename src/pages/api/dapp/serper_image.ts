import type { NextApiRequest, NextApiResponse } from 'next'
import { fetcher } from '@/lib/fetcher'

export default async function serper_image(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query || !req.query?.name) return
  const { query } = req

  let response = await fetcher({
    method: 'post',
    url: 'https://google.serper.dev/images',
    headers: {
      'X-API-KEY': process.env.SERPER_API_KEY,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      q: `${query.name} logo`,
      gl: 'us',
      hl: 'en',
      autocorrect: true,
    }),
  })

  res.status(200).json(response?.images)
}
