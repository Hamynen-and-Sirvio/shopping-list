import type { Request, Response, NextFunction } from 'express'
import { MongoClient } from 'mongodb'
import * as config from '../config.ts'
import { MongoDbStoredRateLimiter } from '../utils/ratelimiter/MongoDbStoredRateLimiter.ts'

const rateLimiter = new MongoDbStoredRateLimiter({
  mongoClient: await MongoClient.connect(config.LIMITER_DB_URL),
  dbName: config.LIMITER_DB_NAME,
  maxPoints: 10,
  duration: 1,
  dbKeyPrefix: 'rateLimiter'
})

export const limiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ipAddr = req.ip
  if (ipAddr === undefined) {
    console.error('ERROR: IP address not set in the request')
    res.status(500).json({ error: 'Internal server error' })
    return
  }

  const rlInfo = await rateLimiter.consume(ipAddr)

  if (rlInfo.isAboveLimit) {
    res.status(429).send('Too many requests')
  } else {
    next()
  }
}
