import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// 创建 Redis 实例
export const redis = Redis.fromEnv()

// 创建速率限制器
export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 每 60 秒最多 10 次请求
  analytics: true, // 可选：启用分析数据
})
