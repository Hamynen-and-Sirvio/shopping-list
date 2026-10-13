import { MongoClient } from 'mongodb'
import { RateLimiterMemory, RateLimiterMongo } from 'rate-limiter-flexible'
import type { IRateLimiterOptions } from 'rate-limiter-flexible'

import { RlFlexibleBasedRateLimiter } from './RlFlexibleBasedRateLimiter.ts'


export interface MongoDbAndRateLimiterConfig {
  mongoClient: MongoClient
  dbName: string
  maxPoints: number
  duration: number
  blockDuration?: number
  dbKeyPrefix: string
}


export class MongoDbStoredRateLimiter extends RlFlexibleBasedRateLimiter {
  constructor(config: MongoDbAndRateLimiterConfig) {
    const rlFlexibleConfig: IRateLimiterOptions = {
      points: config.maxPoints,
      duration: config.duration,
    }

    if (config.blockDuration !== undefined) {
      rlFlexibleConfig.blockDuration = config.blockDuration
    }

    const insuranceLimiter = new RateLimiterMemory(rlFlexibleConfig)

    const rateLimiter = new RateLimiterMongo({
      ...rlFlexibleConfig,
      storeClient: config.mongoClient,
      dbName: config.dbName,
      insuranceLimiter: insuranceLimiter,
      keyPrefix: config.dbKeyPrefix,
    })

    super(rateLimiter, config.maxPoints)
  }
}
