import 'dotenv/config'

import type { PasswordHash } from './utils/password'


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
const [passwordSalt, passwordKey] = process.env['PASSWORD_HASH'].split(':')
if (passwordSalt === undefined || passwordKey === undefined) {
  throw new Error('Invalid password hash')
}
export const passwordHash: PasswordHash = {
  salt: Buffer.from(passwordSalt, 'hex'),
  key: Buffer.from(passwordKey, 'hex'),
}

const SECRET_MIN_LEN = '32'
const SECRET_MAX_LEN = '2048'
const secretFromEnvVar = process.env['SECRET']
if (
  secretFromEnvVar === undefined ||
  !RegExp(`^[0-9a-fA-F]{${SECRET_MIN_LEN},${SECRET_MAX_LEN}}$`).test(secretFromEnvVar)
) {
  throw new Error(
    `Environment variable SECRET should contain a ` +
    `${SECRET_MIN_LEN}-${SECRET_MAX_LEN} digit long hexadecimal number`
  )
}
export const SECRET = Buffer.from(secretFromEnvVar, 'hex')

export const RATE_LIMITER = process.env['RATE_LIMITER']

export const NODE_ENV = process.env['NODE_ENV']
