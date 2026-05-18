import { randomBytes, scryptSync } from 'crypto'

const PASSWORD = 'password'

const salt = randomBytes(16).toString('hex')
const hash = scryptSync(PASSWORD, salt, 64).toString('hex')

console.log(`${salt}:${hash}`)