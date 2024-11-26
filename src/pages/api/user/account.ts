import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  let method = req.method.toUpperCase()

  if (method === 'PUT' || method === 'POST') {
    let { id, createdAt, updatedAt, ...others } = req.body

    if (!id) {
      res.status(400).json({ ok: false, message: 'User id is required ˙◠˙' })
      return
    }

    try {
      const upsertedStudio = await prisma.user.upsert({
        where: { id },
        update: {
          ...others,
          updatedAt: new Date(),
        },
        create: {
          ...others,
        },
      })

      res.status(200).json({ ok: true, data: upsertedStudio })
    } catch (error) {
      console.log(error)
      res.status(500).json({ ok: false, message: 'Failed to update user ˙◠˙' })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
