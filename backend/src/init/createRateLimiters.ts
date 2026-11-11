import type { LimiterDbConfig } from '../config'
import { RateLimiterFactory } from '../utils/RateLimiterFactory.ts'


export const createRateLimiters = async (limiterDbConfig: LimiterDbConfig | null) => {
  const rateLimiterFactory = new RateLimiterFactory(limiterDbConfig)

  const rateLimiter = await rateLimiterFactory.createRateLimiter({
    name: 'rateLimiter',
    maxPoints: 10,
    durationSecs: 1,
  })

  const loginLimiter = await rateLimiterFactory.createRateLimiter({
    name: 'loginLimiter',
    maxPoints: 5,
    durationSecs: 60 * 60 * 3,
    blockDurationSecs: 60 * 15,
  })

  return { rateLimiter, loginLimiter }
}
