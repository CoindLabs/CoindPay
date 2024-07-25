import type { NextApiRequest, NextApiResponse } from 'next'
import { nanoid } from 'nanoid'
import prisma from '@/lib/prisma'

export default async function payee(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      const { id, style, ...content } = req.body
      if (!id || !style) {
        return res.status(400).json({ ok: false, message: 'User id and style are required ˙◠˙' })
      }

      try {
        const user = await prisma.user.findUnique({
          where: { id },
        })

        if (!user) {
          return res.status(404).json({ ok: false, message: 'User not found ˙◠˙' })
        }

        const payee = await prisma.payee.upsert({
          where: { uuid: user.id },
          update: { style, ...content },
          create: {
            id: nanoid(),
            uuid: user.id,
            style,
            ...content,
          },
        })

        res.status(200).json({ ok: true, data: payee })
      } catch (error) {
        console.error(error)
        res.status(500).json({ ok: false, message: error.message || 'Server error ˙◠˙' })
      }
      break

    case 'GET':
      if (!req?.query?.id) {
        return res.status(400).json({ ok: false, message: 'User id is required ˙◠˙' })
      }

      try {
        const payee = await prisma.payee.findUnique({
          where: { uuid: req?.query?.id as string },
        })

        if (!payee) {
          return res.status(404).json({ ok: false, message: 'Payee not found ˙◠˙' })
        }

        res.status(200).json({ ok: true, data: payee })
      } catch (error) {
        console.error(error)
        res.status(500).json({ ok: false, message: error.message || 'Server error ˙◠˙' })
      }

      break

    default:
      res.status(405).json({ ok: false, message: 'Method not allowed ˙◠˙' })

      break
  }
}