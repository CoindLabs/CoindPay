import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { serialize, parse } from 'cookie'
import { env } from '@/lib/types/env'
import { store } from '@/lib/store'
import { setUserInfo } from '@/store/slice/user'

// 生成 JWT
export const jwtToken = (uuid: string) => {
  return jwt.sign({ id: uuid }, env.apiJwtSecret, { expiresIn: '30d' }) // 设置有效期为30天
}

// 设置 cookie
export const setCookie = (token: string, res: NextApiResponse) => {
  // 使用 cookie 库序列化 cookie 字符串
  const cookieString = serialize('authorization', token, {
    path: '/',
    httpOnly: true,
    secure: !env.isDev, // 生产环境下启用 Secure
    sameSite: 'strict', // 防止跨站请求
    maxAge: 30 * 24 * 60 * 60, // 30天
  })

  // 设置 Set-Cookie 头
  res.setHeader('Set-Cookie', cookieString)
}

export function getCookies(req) {
  return req.headers.cookie ? parse(req.headers.cookie) : {}
}

export function onLogout() {
  // 清除 cookie 或 token
  document.cookie = 'authorization=; Max-Age=0; path=/; Secure; SameSite=Strict;' // 清除 cookie
  // 清除 Storage
  store.dispatch(setUserInfo(null))
}
