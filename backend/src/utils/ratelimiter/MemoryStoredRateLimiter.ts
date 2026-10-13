import { RateLimiterMemory } from 'rate-limiter-flexible'
import type { IRateLimiterOptions } from 'rate-limiter-flexible'

import { RlFlexibleBasedRateLimiter } from './RlFlexibleBasedRateLimiter.ts'


export interface RateLimiterConfig {
  maxPoints: number
  duration: number
  blockDuration?: number
}


export class MemoryStoredRateLimiter extends RlFlexibleBasedRateLimiter {
  constructor(config: RateLimiterConfig) {
    const rlFlexibleConfig: IRateLimiterOptions = {
      points: config.maxPoints,
      duration: config.duration,
    }

    if (config.blockDuration !== undefined) {
      rlFlexibleConfig.blockDuration = config.blockDuration
    }

    const rateLimiter = new RateLimiterMemory(rlFlexibleConfig)

    super(rateLimiter, config.maxPoints)
  }
}
