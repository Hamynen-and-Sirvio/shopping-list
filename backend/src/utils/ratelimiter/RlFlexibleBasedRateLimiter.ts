import { RateLimiterRes } from 'rate-limiter-flexible'
import type { RateLimiterAbstract } from 'rate-limiter-flexible'

import type { RateLimiter, RateLimitingInfo } from './RateLimiter.ts'


export abstract class RlFlexibleBasedRateLimiter implements RateLimiter {
  #rateLimiter: RateLimiterAbstract
  #maxPoints: number

  constructor(rateLimiter: RateLimiterAbstract, maxPoints: number) {
    this.#rateLimiter = rateLimiter
    this.#maxPoints = maxPoints
  }

  async getInfo(ipAddr: string): Promise<RateLimitingInfo> {
    const rlRes = await this.#rateLimiter.get(ipAddr)

    if (rlRes === null) {
      return {
        isAboveLimit: false,
        retrySecs: 0,
        consumedPoints: 0,
      }
    }

    return {
      isAboveLimit: rlRes.consumedPoints > this.#maxPoints,
      retrySecs: Math.round(rlRes.msBeforeNext / 1000) || 1,
      consumedPoints: rlRes.consumedPoints,
    }
  }

  async consume(ipAddr: string): Promise<RateLimitingInfo> {
    try {
      const rlRes = await this.#rateLimiter.consume(ipAddr)

      return {
        isAboveLimit: rlRes.consumedPoints > this.#maxPoints,
        retrySecs: Math.round(rlRes.msBeforeNext / 1000) || 1,
        consumedPoints: rlRes.consumedPoints,
      }
    } catch (error) {
      if (error instanceof RateLimiterRes) {
        const rlRes = error

        return {
          isAboveLimit: rlRes.consumedPoints > this.#maxPoints,
          retrySecs: Math.round(rlRes.msBeforeNext / 1000) || 1,
          consumedPoints: rlRes.consumedPoints,
        }
      } else {
        throw error
      }
    }
  }

  async reset(ipAddr: string): Promise<void> {
    await this.#rateLimiter.delete(ipAddr)
  }
}
