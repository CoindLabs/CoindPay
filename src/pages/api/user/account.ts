import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function account(req: NextApiRequest, res: NextApiResponse) {
  let method = req.method.toUpperCase()
  if (method === 'PUT' || method === 'POST') {
    const { id, nickname, bio } = req.body

    if (!id) {
      res.status(400).json({ ok: false, message: 'User id is required ˙◠˙' })
      return
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          nickname,
          bio,
        },
      })

      res.status(200).json({ ok: true, data: updatedUser })
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Failed to update user ˙◠˙' })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
