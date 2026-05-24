import { randomBytes, scryptSync } from 'node:crypto'

const PASSWORD = 'password'

const salt = randomBytes(16)
const hash = scryptSync(PASSWORD, salt, 64)

console.log(`${salt.toString('hex')}:${hash.toString('hex')}`)
