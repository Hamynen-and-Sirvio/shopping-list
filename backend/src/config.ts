import 'dotenv/config'

import type { PasswordHash } from './utils/password'


export interface LimiterDbConfig {
  url: string
  dbName: string
}


if (process.env['DATABASE_URL'] === undefined) {
  throw new Error('Environment variable DATABASE_URL not defined')
}
export const DATABASE_URL = process.env['DATABASE_URL']

const LIMITER_DB_URL = process.env['LIMITER_DB_URL']
const LIMITER_DB_NAME = process.env['LIMITER_DB_NAME']
let limiterDbTemp: LimiterDbConfig | null = null
if (LIMITER_DB_URL && LIMITER_DB_NAME) {
  limiterDbTemp = Object.freeze({ url: LIMITER_DB_URL, dbName: LIMITER_DB_NAME })
}
export const limiterDb = limiterDbTemp

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
export const secretKey = Buffer.from(secretFromEnvVar, 'hex')

export const RATE_LIMITER = process.env['RATE_LIMITER']

export const isInTestingMode = process.env['NODE_ENV'] === 'test'
