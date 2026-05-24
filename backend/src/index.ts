import cors from 'cors'
import express from 'express'
import { MongoClient } from 'mongodb'
import morgan from 'morgan'
import { RateLimiterMemory, RateLimiterMongo } from 'rate-limiter-flexible'
import { prisma } from '../lib/prisma.ts'

import * as config from './config.ts'
import EntryRepository from './EntryRepository.ts'
import { createEntriesRouter } from './routers/entries.ts'
import { createLoginRouter, isLoggedIn } from './routers/login.ts'
import { limiter } from './middleware/rateLimiter.ts'

const MAX_CONSECUTIVE_FAILS_BY_IP = 5

process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())

const entryRepository = new EntryRepository(prisma)

const app = express()

app.use(limiter)
app.use(morgan('combined'))
app.use(cors({ origin: config.CORS_ORIGINS }))
app.use(express.json())

const insuranceLimiter = new RateLimiterMemory({
  points: MAX_CONSECUTIVE_FAILS_BY_IP,
  duration: 60 * 60 * 3,
  blockDuration: 60 * 15,
})

const limiterConsecutiveFailsByIp = new RateLimiterMongo({
  storeClient: MongoClient.connect(config.LIMITER_DB_URL),
  dbName: config.LIMITER_DB_NAME,
  points: MAX_CONSECUTIVE_FAILS_BY_IP,
  duration: 60 * 60 * 3,
  blockDuration: 60 * 15,
  insuranceLimiter: insuranceLimiter,
  keyPrefix: 'limiterConsecutiveFailsByIp',
})

const loginRouter = createLoginRouter(
  config.SECRET,
  config.PASSWORD_HASH,
  MAX_CONSECUTIVE_FAILS_BY_IP,
  limiterConsecutiveFailsByIp,
)
app.use('/login', loginRouter)

app.use((req, res, next) => {
  if (!isLoggedIn(req, config.SECRET)) {
    res.status(401).send('Not authorized to access this URL')
    return
  }

  next()
})

const entriesRouter = createEntriesRouter(entryRepository)
app.use('/entries', entriesRouter)

app.listen(parseInt(config.PORT), config.HOST, () => {
  console.log(`Server running on 'http://${config.HOST}:${config.PORT}'`)
})
