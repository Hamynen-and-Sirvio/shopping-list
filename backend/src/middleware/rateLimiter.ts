import type { Request, Response, NextFunction } from 'express'
import { MongoClient } from 'mongodb'
import { RateLimiterMemory, RateLimiterMongo } from 'rate-limiter-flexible'
import * as config from '../config.ts'

const insuranceLimiter = new RateLimiterMemory({
  points: 10,
  duration: 1,
})

const rateLimiter = new RateLimiterMongo({
  storeClient: MongoClient.connect(config.LIMITER_DB_URL),
  dbName: config.LIMITER_DB_NAME,
  points: 10,
  duration: 1,
  insuranceLimiter: insuranceLimiter,
  keyPrefix: 'rateLimiter',
})

export const limiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ipAddr = req.ip
    if (ipAddr === undefined) {
      console.error('ERROR: IP address not set in the request')
      res.status(500).json({ error: 'Internal server error' })
      return
    }

    await rateLimiter.consume(ipAddr)
    next()
  } catch {
    res.status(429).send('Too many requests')
  }
}
