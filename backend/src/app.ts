import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import entriesRouter from './routers/entries.ts'
import loginRouter from './routers/login.ts'
import requireAuthorizationToken from './middleware/authorizationChecker.ts'
import errorHandler from './middleware/errorHandler.ts'
import rateLimiterMiddleware from './middleware/rateLimiter.ts'


export const createApp = async (
  authUtilFunctions: any,
  rateLimiters: any,
  repositories: any,
  corsOrigins: false | string[],
  isInTestingMode: boolean,
) => {
  const { generateAuthToken, isTokenValid, isPasswordCorrect } = authUtilFunctions
  const { rateLimiter, loginLimiter } = rateLimiters
  const { entryRepository } = repositories

  const app = express()

  app.use(morgan('combined'))
  if (rateLimiter !== null) {
    app.use(rateLimiterMiddleware(rateLimiter))
  }
  app.use(cors({ origin: corsOrigins }))
  app.use(express.json())

  app.use('/login', loginRouter(generateAuthToken, isPasswordCorrect, loginLimiter))
  app.use(requireAuthorizationToken(isTokenValid))
  app.use('/entries', entriesRouter(entryRepository, isInTestingMode))

  app.all('{*splat}', (_, res) => res.status(404).json({ error: 'Resource not found' }))
  app.use(errorHandler)

  return app
}
