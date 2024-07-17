// https://github.com/prisma/accelerate-nextjs-starter/blob/main/lib/db.ts

import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export default prisma
