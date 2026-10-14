import 'dotenv/config'

if (process.env['DATABASE_URL'] === undefined) {
  throw new Error('Environment variable DATABASE_URL not defined')
}
export const DATABASE_URL = process.env['DATABASE_URL']

// MongoDB store is used for the rate limiter only if both LIMITER_DB_URL
// and LIMITER_DB_NAME are set
export const LIMITER_DB_URL = process.env['LIMITER_DB_URL']
export const LIMITER_DB_NAME = process.env['LIMITER_DB_NAME']

if (process.env['PORT'] === undefined) {
  throw new Error('Environment variable PORT not defined')
}
export const PORT = process.env['PORT']

if (process.env['HOST'] === undefined) {
  throw new Error('Environment variable HOST not defined')
}
export const HOST = process.env['HOST']

export const CORS_ORIGINS = process.env['CORS_ORIGINS']?.split(',') ?? false

if (process.env['PASSWORD_HASH'] === undefined) {
  throw new Error('Environment variable PASSWORD_HASH not defined')
}
export const PASSWORD_HASH = process.env['PASSWORD_HASH']

if (process.env['SECRET'] === undefined) {
  throw new Error('Environment variable SECRET not defined')
}
export const SECRET = process.env['SECRET']

export const RATE_LIMITER = process.env['RATE_LIMITER']

export const NODE_ENV = process.env['NODE_ENV']
