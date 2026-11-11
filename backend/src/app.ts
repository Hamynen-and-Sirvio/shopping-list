import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import type { LimiterDbConfig } from './config.ts'
import entriesRouter from './routers/entries.ts'
import loginRouter from './routers/login.ts'
import { createAuthUtilFunctions } from './init/createAuthUtilFunctions.ts'
import { createRateLimiters } from './init/createRateLimiters.ts'
import { createRepositories } from './init/createRepositories.ts'
import requireAuthorizationToken from './middleware/authorizationChecker.ts'
import errorHandler from './middleware/errorHandler.ts'
import rateLimiterMiddleware from './middleware/rateLimiter.ts'
import type { PasswordHash } from './utils/password.ts'


interface Config {
  secretKey: Buffer
  passwordHash: PasswordHash
  limiterDb: LimiterDbConfig | null
  useRateLimiter: boolean
  corsOrigins: false | string[]
  isInTestingMode: boolean
}


export const createApp = async (config: Config) => {
  const { generateAuthToken, isTokenValid, isPasswordCorrect } =
    createAuthUtilFunctions(config.secretKey, config.passwordHash)
  const { rateLimiter, loginLimiter } = await createRateLimiters(config.limiterDb)
  const { entryRepository } = createRepositories()

  const app = express()

  app.use(morgan('combined'))
  if (config.useRateLimiter) {
    app.use(rateLimiterMiddleware(rateLimiter))
  }
  app.use(cors({ origin: config.corsOrigins }))
  app.use(express.json())

  app.use('/login', loginRouter(generateAuthToken, isPasswordCorrect, loginLimiter))
  app.use(requireAuthorizationToken(isTokenValid))
  app.use('/entries', entriesRouter(entryRepository, config.isInTestingMode))

  app.all('{*splat}', (_, res) => res.status(404).json({ error: 'Resource not found' }))
  app.use(errorHandler)

  return app
}
