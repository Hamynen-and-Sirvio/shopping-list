import { MongoClient } from 'mongodb'

import type { LimiterDbConfig } from '../config.ts'
import { MemoryStoredRateLimiter } from './ratelimiter/MemoryStoredRateLimiter.ts'
import { MongoDbStoredRateLimiter } from './ratelimiter/MongoDbStoredRateLimiter.ts'


export interface CreationConfig {
  name: string
  maxPoints: number
  durationSecs: number
  blockDurationSecs?: number
}


export class RateLimiterFactory {
  #mongoClient: MongoClient | null = null
  #dbConfig: LimiterDbConfig | null

  constructor(dbConfig: LimiterDbConfig | null) {
    this.#dbConfig = dbConfig
  }

  async createRateLimiter(config: CreationConfig) {
    if (this.#dbConfig !== null) {
      if (this.#mongoClient === null) {
        this.#mongoClient = await MongoClient.connect(this.#dbConfig.url)
      }

      return new MongoDbStoredRateLimiter({
        mongoClient: this.#mongoClient,
        dbName: this.#dbConfig.dbName,
        maxPoints: config.maxPoints,
        duration: config.durationSecs,
        ...(config.blockDurationSecs && { blockDuration: config.blockDurationSecs }),
        dbKeyPrefix: config.name,
      })
    } else {
      return new MemoryStoredRateLimiter({
        maxPoints: config.maxPoints,
        duration: config.durationSecs,
        ...(config.blockDurationSecs && { blockDuration: config.blockDurationSecs }),
      })
    }
  }
}
