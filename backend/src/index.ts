import cors from 'cors';
import 'dotenv/config'
import express from 'express'
import { MongoClient } from 'mongodb'
import morgan from 'morgan'

import {
  RateLimiterMemory,
  RateLimiterMongo,
} from 'rate-limiter-flexible'

import { prisma } from '../lib/prisma.ts'

import EntryRepository from './EntryRepository.ts'
import { createEntriesRouter } from './routers/entries.ts'
import { createLoginRouter, isLoggedIn } from './routers/login.ts'


const MAX_CONSECUTIVE_FAILS_BY_IP = 5

const DATABASE_URL = process.env.DATABASE_URL
if (DATABASE_URL === undefined) {
  throw new Error('Environment variable DATABASE_URL not defined');
}

const LIMITER_DB_URL = process.env.LIMITER_DB_URL
if (LIMITER_DB_URL === undefined) {
  throw new Error('Environment variable LIMITER_DB_URL not defined');
}

const LIMITER_DB_NAME = process.env.LIMITER_DB_NAME
if (LIMITER_DB_NAME === undefined) {
  throw new Error('Environment variable LIMITER_DB_NAME not defined');
}

if (process.env.PORT === undefined) {
  throw new Error('Environment variable PORT not defined');
}
const PORT = parseInt(process.env.PORT)

const HOST = process.env.HOST
if (HOST === undefined) {
  throw new Error('Environment variable HOST not defined');
}

const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') || false

const PASSWORD_HASH = process.env.PASSWORD_HASH
if (PASSWORD_HASH === undefined) {
  throw new Error('Environment variable PASSWORD_HASH not defined');
}

const SECRET = process.env.SECRET
if (SECRET === undefined) {
  throw new Error('Environment variable SECRET not defined');
}

process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())

const entryRepository = new EntryRepository(prisma)

const app = express()

app.use(morgan('combined'))
app.use(cors({ origin: CORS_ORIGINS }))
app.use(express.json())

const insuranceLimiter = new RateLimiterMemory({
  points: MAX_CONSECUTIVE_FAILS_BY_IP,
  duration: 60 * 60 * 3,
  blockDuration: 60 * 15,
})

const limiterConsecutiveFailsByIp = new RateLimiterMongo({
  storeClient: MongoClient.connect(LIMITER_DB_URL),
  dbName: LIMITER_DB_NAME,
  points: MAX_CONSECUTIVE_FAILS_BY_IP,
  duration: 60 * 60 * 3,
  blockDuration: 60 * 15,
  insuranceLimiter: insuranceLimiter,
})

app.get('/', (req, res) => {
  res.send('DO NOT USE ROOT PATH')
})

const loginRouter = createLoginRouter(
  SECRET,
  PASSWORD_HASH,
  MAX_CONSECUTIVE_FAILS_BY_IP,
  limiterConsecutiveFailsByIp,
)
app.use('/login', loginRouter)

app.use((req, res, next) => {
  if (!isLoggedIn(req, SECRET)) {
    res.status(401).send('Not authorized to access this URL')
    return
  }

  next()
})

const entriesRouter = createEntriesRouter(entryRepository)
app.use('/entries', entriesRouter)

app.listen(PORT, HOST, () => {
  console.log(`Server running on 'http://${HOST}:${PORT}'`)
})
