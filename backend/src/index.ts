import cors from 'cors'
import express from 'express'
import type { ErrorRequestHandler } from 'express'
import { MongoClient } from 'mongodb'
import morgan from 'morgan'
import { prisma } from '../lib/prisma.ts'

import * as config from './config.ts'
import EntryRepository from './EntryRepository.ts'
import { createEntriesRouter } from './routers/entries.ts'
import { createLoginRouter, isLoggedIn } from './routers/login.ts'
import { limiter } from './middleware/rateLimiter.ts'
import { MemoryStoredRateLimiter } from './utils/ratelimiter/MemoryStoredRateLimiter.ts'
import { MongoDbStoredRateLimiter } from './utils/ratelimiter/MongoDbStoredRateLimiter.ts'

const MAX_CONSECUTIVE_FAILS_BY_IP = 5

process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())

const isTesting = config.NODE_ENV === 'test'

const entryRepository = new EntryRepository(prisma)

const app = express()

if (config.RATE_LIMITER !== 'off') {
  app.use(limiter)
}
app.use(morgan('combined'))
app.use(cors({ origin: config.CORS_ORIGINS }))
app.use(express.json())

const limiterConsecutiveFailsByIp =
  (config.LIMITER_DB_URL && config.LIMITER_DB_NAME) ?
  new MongoDbStoredRateLimiter({
    mongoClient: await MongoClient.connect(config.LIMITER_DB_URL),
    dbName: config.LIMITER_DB_NAME,
    maxPoints: MAX_CONSECUTIVE_FAILS_BY_IP,
    duration: 60 * 60 * 3,
    blockDuration: 60 * 15,
    dbKeyPrefix: 'limiterConsecutiveFailsByIp',
  }) :
  new MemoryStoredRateLimiter({
    maxPoints: MAX_CONSECUTIVE_FAILS_BY_IP,
    duration: 60 * 60 * 3,
    blockDuration: 60 * 15,
  })

const loginRouter = createLoginRouter(
  config.SECRET,
  config.PASSWORD_HASH,
  limiterConsecutiveFailsByIp,
)
app.use('/login', loginRouter)

app.use((req, res, next) => {
  if (!isLoggedIn(req, config.SECRET)) {
    res.status(401).json({ error: 'Not authorized to access this URL' })
    return
  }

  next()
})

const entriesRouter = createEntriesRouter(entryRepository, isTesting)
app.use('/entries', entriesRouter)

app.all('{*splat}', (_, res) => {
  res.status(404).json({ error: 'Resource not found' })
})

const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  if (res.headersSent) {
    next(err)
    return
  }
  if (err instanceof Error) {
    console.error(err.stack)
  }
  res.status(500).json({ error: 'Internal server error' })
}
app.use(errorHandler)

app.listen(parseInt(config.PORT), config.HOST, () => {
  console.log(`Server running on 'http://${config.HOST}:${config.PORT}'`)
})
