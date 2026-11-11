import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { prisma } from '../lib/prisma.ts'

import * as config from './config.ts'
import EntryRepository from './database/EntryRepository.ts'
import entriesRouter from './routers/entries.ts'
import loginRouter from './routers/login.ts'
import { createAuthUtilFunctions } from './init/createAuthUtilFunctions.ts'
import requireAuthorizationToken from './middleware/authorizationChecker.ts'
import errorHandler from './middleware/errorHandler.ts'
import rateLimiterMiddleware from './middleware/rateLimiter.ts'
import { RateLimiterFactory } from './utils/RateLimiterFactory.ts'

process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())

const entryRepository = new EntryRepository(prisma)

const app = express()

const rateLimiterFactory = new RateLimiterFactory(config.limiterDb)

const limiterRequestsByIp = await rateLimiterFactory.createRateLimiter({
  name: 'limiterRequestsByIp',
  maxPoints: 10,
  durationSecs: 1,
})

if (config.useRateLimiter) {
  app.use(rateLimiterMiddleware(limiterRequestsByIp))
}
app.use(morgan('combined'))
app.use(cors({ origin: config.corsOrigins }))
app.use(express.json())

const limiterConsecutiveFailsByIp = await rateLimiterFactory.createRateLimiter({
  name: 'limiterConsecutiveFailsByIp',
  maxPoints: 5,
  durationSecs: 60 * 60 * 3,
  blockDurationSecs: 60 * 15,
})

const { generateAuthToken, isTokenValid, isPasswordCorrect } =
  createAuthUtilFunctions(config.secretKey, config.passwordHash)

app.use('/login', loginRouter(generateAuthToken, isPasswordCorrect, limiterConsecutiveFailsByIp))

app.use(requireAuthorizationToken(isTokenValid))

app.use('/entries', entriesRouter(entryRepository, config.isInTestingMode))

app.all('{*splat}', (_, res) => res.status(404).json({ error: 'Resource not found' }))

app.use(errorHandler)

app.listen(config.port, config.host, () => {
  console.log(`Server running on 'http://${config.host}:${String(config.port)}'`)
})
