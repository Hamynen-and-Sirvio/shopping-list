import cors from 'cors'
import express from 'express'
import { MongoClient } from 'mongodb'
import morgan from 'morgan'
import { prisma } from '../lib/prisma.ts'

import * as config from './config.ts'
import EntryRepository from './database/EntryRepository.ts'
import entriesRouter from './routers/entries.ts'
import loginRouter from './routers/login.ts'
import requireAuthorizationToken from './middleware/authorizationChecker.ts'
import errorHandler from './middleware/errorHandler.ts'
import rateLimiterMiddleware from './middleware/rateLimiter.ts'
import { JwtAuthorizationManager } from './utils/auth/JwtAuthorizationManager.ts'
import type { TokenAuthorizationManager } from './utils/auth/TokenAuthorizationManager.ts'
import { scryptHashMatches } from './utils/password.ts'
import { MemoryStoredRateLimiter } from './utils/ratelimiter/MemoryStoredRateLimiter.ts'
import { MongoDbStoredRateLimiter } from './utils/ratelimiter/MongoDbStoredRateLimiter.ts'

const MAX_CONSECUTIVE_FAILS_BY_IP = 5

process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())

const entryRepository = new EntryRepository(prisma)

const app = express()

const limiterRequestsByIp =
  (config.LIMITER_DB_URL && config.LIMITER_DB_NAME) ?
  new MongoDbStoredRateLimiter({
    mongoClient: await MongoClient.connect(config.LIMITER_DB_URL),
    dbName: config.LIMITER_DB_NAME,
    maxPoints: 10,
    duration: 1,
    dbKeyPrefix: 'limiterRequestsByIp',
  }) :
  new MemoryStoredRateLimiter({
    maxPoints: 10,
    duration: 1,
  })

if (config.RATE_LIMITER !== 'off') {
  app.use(rateLimiterMiddleware(limiterRequestsByIp))
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

const authorizationManager: TokenAuthorizationManager =
  new JwtAuthorizationManager(config.secretKey)

const generateAuthorizationToken = () => authorizationManager.generateToken()

const isPasswordCorrect = (password: string) =>
  scryptHashMatches(password, config.passwordHash)

app.use(
  '/login',
  loginRouter(
    generateAuthorizationToken,
    isPasswordCorrect,
    limiterConsecutiveFailsByIp,
  )
)

const isTokenValid = (token: string) => authorizationManager.checkValidityOf(token)

app.use(requireAuthorizationToken(isTokenValid))

app.use('/entries', entriesRouter(entryRepository, config.isInTestingMode))

app.all('{*splat}', (_, res) => res.status(404).json({ error: 'Resource not found' }))

app.use(errorHandler)

app.listen(parseInt(config.PORT), config.HOST, () => {
  console.log(`Server running on 'http://${config.HOST}:${config.PORT}'`)
})
