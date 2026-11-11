import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import * as config from './config.ts'
import entriesRouter from './routers/entries.ts'
import loginRouter from './routers/login.ts'
import { createAuthUtilFunctions } from './init/createAuthUtilFunctions.ts'
import { createRateLimiters } from './init/createRateLimiters.ts'
import { createRepositories } from './init/createRepositories.ts'
import requireAuthorizationToken from './middleware/authorizationChecker.ts'
import errorHandler from './middleware/errorHandler.ts'
import rateLimiterMiddleware from './middleware/rateLimiter.ts'

process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())

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

app.listen(config.port, config.host, () => {
  console.log(`Server running on 'http://${config.host}:${String(config.port)}'`)
})
