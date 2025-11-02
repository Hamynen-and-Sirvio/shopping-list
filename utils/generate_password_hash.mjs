import { randomBytes, scryptSync } from 'crypto'

const PASSWORD = 'password'

const uintPwd = Uint8Array.from(Buffer.from(PASSWORD, 'base64').toString('binary'), c => c.charCodeAt(0))

const salt = randomBytes(16).toString('hex')
const hash = scryptSync(uintPwd, salt, 64).toString('hex')

console.log(`${salt}:${hash}`)