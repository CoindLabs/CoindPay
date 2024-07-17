import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function address(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed ˙◠˙' })
  }

  const { addressList } = req.body

  if (!addressList || !addressList.length) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid payment request ˙◠˙',
    })
  }

  try {
    // 验证 addressList
    if (!Array.isArray(addressList) || addressList.some(address => !address.chain || !address.value)) {
      return res.status(400).json({ ok: false, message: 'Each address must have a chain and value ˙◠˙' })
    }

    const boundAddressList = await findConflictingUsers(addressList)

    if (boundAddressList.length > 1) {
      return res.status(409).json({
        ok: false,
        message: 'Some addresses are already bound to other users',
        boundAddressList,
      })
    }

    const user = await upsertUser(addressList, boundAddressList)
    res.status(200).json({ ok: true, data: user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Server error ˙◠˙' })
  }
}

async function findConflictingUsers(addressList) {
  const users = await prisma.user.findMany()
  const conflictingUsers = []

  for (const user of users) {
    // @ts-ignore
    const list = Array.isArray(user.addressList) ? user.addressList : JSON.parse(user.addressList || '[]')
    const conflicts = list.filter(row => addressList.some(address => address.value === row.value))
    if (conflicts.length > 0) {
      conflictingUsers.push({
        uuid: user.id,
        addresses: conflicts,
      })
    }
  }

  return conflictingUsers
}

async function upsertUser(addressList, conflictingUsers) {
  if (conflictingUsers.length === 1) {
    // 更新现有用户
    const user = conflictingUsers[0]

    return await prisma.user.update({
      where: { id: user.uuid },
      data: { addressList },
    })
  } else {
    // 创建新用户
    const newUser = await prisma.user.create({
      data: {
        addressList,
      },
    })

    return newUser
  }
}
