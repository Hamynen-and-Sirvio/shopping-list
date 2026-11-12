import * as config from './config.ts'
import { createApp } from './app.ts'
import { createAuthUtilFunctions } from './init/createAuthUtilFunctions.ts'
import { createRateLimiters } from './init/createRateLimiters.ts'
import { createRepositories } from './init/createRepositories.ts'


process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())

const app = await createApp(
  createAuthUtilFunctions(config.secretKey, config.passwordHash),
  await createRateLimiters(config.limiterDb, config.useRateLimiter),
  createRepositories(),
  config.corsOrigins,
  config.isInTestingMode,
)

app.listen(config.port, config.host, () => {
  console.log(`Server running on 'http://${config.host}:${String(config.port)}'`)
})
