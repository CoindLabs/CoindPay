import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function landing(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { chain, chainId, amount, symbol, contract, payeeId, message, signature, payer } = req.body

    if (!chain || !amount || !contract || !payeeId || !signature || !payer) {
      res.status(502).json({
        ok: false,
        message: 'Invalid payment request ˙◠˙',
      })
    }

    try {
      const payment = await prisma.payment.create({
        data: {
          chain,
          chainId,
          amount,
          contract,
          symbol,
          message,
          payeeId,
          payer,
          signature,
        },
      })

      res.status(201).json({
        ok: true,
        message: 'Payment submitted success ᵔ◡ᵔ',
        paymentId: payment.id,
      })
    } catch (error) {
      console.error('Error submitting payment:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to submit payment ˙◠˙',
      })
    }
  } else if (req.method === 'GET') {
    const { uuid } = req?.query

    if (!uuid) {
      res.status(400).json({
        ok: false,
        message: 'Invalid payment request ˙◠˙',
      })
    }
    try {
      // Step 1: 根据 uuid 查找所有相关的 payees
      const payees = await prisma.payee.findMany({
        where: {
          uuid: String(uuid),
        },
        select: {
          id: true,
        },
      })

      // 提取 payees 的 id
      const payeeIds = payees.map(payee => payee.id)

      // Step 2: 根据 payeeIds 查找所有对应的 payments
      const payments = await prisma.payment.findMany({
        where: {
          payeeId: {
            in: payeeIds,
          },
        },
        orderBy: {
          createdAt: 'desc', // 或者 'asc'，以指定升序或降序排列
        },
      })

      res.status(200).json({ ok: true, data: payments })
    } catch (error) {
      console.error('Error fetching payments:', error)
      res.status(500).json({ ok: false, error: 'Server error ˙◠˙' })
    }
  } else {
    res.status(405).json({
      ok: false,
      error: 'Method not allowed ˙◠˙',
    })
  }
}
