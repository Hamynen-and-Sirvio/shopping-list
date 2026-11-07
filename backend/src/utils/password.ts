import crypto from 'node:crypto'


export interface PasswordHash {
  salt: ArrayBufferLike | NodeJS.ArrayBufferView
  key: ArrayBufferLike | NodeJS.ArrayBufferView
}

export const scryptHashMatches = (password: string, passwordHash: PasswordHash) => {
  const calculatedHash = crypto.scryptSync(password, passwordHash.salt, 64)
  return crypto.timingSafeEqual(calculatedHash, passwordHash.key)
}
