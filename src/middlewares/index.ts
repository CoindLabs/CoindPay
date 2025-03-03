import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { parse } from 'cookie'
import { rateLimit } from '@/lib/db/redis'
import { env } from '@/lib/types/env'
import { getUserLogoutSvc } from '@/services/user'

// 鉴权中间件
export const withAuth = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // 从请求中获取 cookies
    const cookies = parse(req.headers?.cookie || '')
    const token = cookies?.authorization // token 存储在 authorization cookie 中

    if (!token) {
      await getUserLogoutSvc()
      return res.status(401).json({ ok: false, error: 'Account token expired ˙◠˙' })
    }

    try {
      const decoded = jwt.verify(token, env.apiJwtSecret)
      ;(req as any).user = decoded
    } catch (error) {
      await getUserLogoutSvc()
      return res.status(401).json({ ok: false, error: 'Invalid account token ˙◠˙' })
    }

    return handler(req, res)
  }
}

// 防刷中间件
export const withRateLimit = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const forwardedFor = req.headers['x-forwarded-for']

    const identifier = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor || req.socket.remoteAddress || 'anonymous'

    const { success } = await rateLimit.limit(identifier)
    if (!success) {
      return res.status(429).json({ ok: false, error: 'Too many requests, please wait and try again ˙◠˙' })
    }

    return handler(req, res)
  }
}

// 合并中间件
export const withAuthAndRateLimit = (handler: Function) => {
  return withRateLimit(withAuth(handler))
}
