import type { RequestHandler } from 'express'

import type { RateLimiter } from '../utils/ratelimiter/RateLimiter.ts'


const createRateLimiterMiddleware = (rateLimiter: RateLimiter) => {
  const rateLimiterMiddleware: RequestHandler = async (req, res, next) => {
    const ipAddr = req.ip
    if (ipAddr === undefined) {
      console.error('ERROR: IP address not set in the request')
      res.status(500).json({ error: 'Internal server error' })
      return
    }

    const rlInfo = await rateLimiter.consume(ipAddr)

    if (rlInfo.isAboveLimit) {
      res.set('Retry-After', String(rlInfo.retrySecs))
      res.status(429).json({ error: 'Too many login attempts' })
    } else {
      next()
    }
  }

  return rateLimiterMiddleware
}


export default createRateLimiterMiddleware
