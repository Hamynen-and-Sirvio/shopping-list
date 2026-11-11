import { MongoClient } from 'mongodb'

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
  #dbUrl: string | null
  #dbName: string | null

  constructor(dbUrl: string | undefined, dbName: string | undefined) {
    this.#dbUrl = dbUrl ?? null
    this.#dbName = dbName ?? null
  }

  async createRateLimiter(config: CreationConfig) {
    if (this.#dbUrl && this.#dbName) {
      if (this.#mongoClient === null) {
        this.#mongoClient = await MongoClient.connect(this.#dbUrl)
      }

      return new MongoDbStoredRateLimiter({
        mongoClient: this.#mongoClient,
        dbName: this.#dbName,
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
