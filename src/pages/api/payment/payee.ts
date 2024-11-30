import type { NextApiRequest, NextApiResponse } from 'next'
import { nanoid } from 'nanoid'
import prisma from '@/lib/prisma'

export default async function payee(req: NextApiRequest, res: NextApiResponse) {
  let { id, uuid, ...content } = req.body

  uuid = req?.body?.uuid || req?.query?.uuid

  if (!uuid) {
    return res.status(400).json({ ok: false, message: 'User id is required ˙◠˙' })
  }

  switch (req.method) {
    case 'POST':
    case 'PUT':
      try {
        const payee = await prisma.payee.upsert({
          where: { id: id || '' },
          update: {
            ...content,
            updatedAt: new Date(),
          },
          create: {
            id: nanoid(),
            uuid,
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
      try {
        const payee = await prisma.payee.findMany({
          where: { uuid: uuid as string },
          orderBy: {
            updatedAt: 'desc', // Use 'asc' for ascending order
          },
        })

        if (!payee) {
          return res.status(404).json({ ok: false, message: 'Payment not found ˙◠˙' })
        }

        res.status(200).json({ ok: true, data: payee })
      } catch (error) {
        console.error(error)
        res.status(500).json({ ok: false, message: error.message || 'Server error ˙◠˙' })
      }

      break

    case 'DELETE':
      try {
        await prisma.payee.delete({
          where: { id: id as string },
        })

        res.status(200).json({ ok: true, message: 'Payment deleted successfully ᵔ◡ᵔ' })
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
