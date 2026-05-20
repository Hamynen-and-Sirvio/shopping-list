import 'dotenv/config'

if (process.env.DATABASE_URL === undefined) {
  throw new Error('Environment variable DATABASE_URL not defined');
}
export const DATABASE_URL = process.env.DATABASE_URL

if (process.env.LIMITER_DB_URL === undefined) {
  throw new Error('Environment variable LIMITER_DB_URL not defined');
}
export const LIMITER_DB_URL = process.env.LIMITER_DB_URL

if (process.env.LIMITER_DB_NAME === undefined) {
  throw new Error('Environment variable LIMITER_DB_NAME not defined');
}
export const LIMITER_DB_NAME = process.env.LIMITER_DB_NAME

if (process.env.PORT === undefined) {
  throw new Error('Environment variable PORT not defined');
}
export const PORT = parseInt(process.env.PORT)

if (process.env.HOST === undefined) {
  throw new Error('Environment variable HOST not defined');
}
export const HOST = process.env.HOST

export const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') || false

if (process.env.PASSWORD_HASH === undefined) {
  throw new Error('Environment variable PASSWORD_HASH not defined');
}
export const PASSWORD_HASH = process.env.PASSWORD_HASH

if (process.env.SECRET === undefined) {
  throw new Error('Environment variable SECRET not defined');
}
export const SECRET = process.env.SECRET
