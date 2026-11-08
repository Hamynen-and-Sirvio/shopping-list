import jwt from 'jsonwebtoken'

import type { TokenAuthorizationManager } from "./TokenAuthorizationManager.ts"


export class JwtAuthorizationManager implements TokenAuthorizationManager {
  #secret: Buffer

  constructor(secret: Buffer) {
    this.#secret = secret
  }

  generateToken() {
    return jwt.sign({}, this.#secret)
  }

  checkValidityOf(token: string) {
    try {
      jwt.verify(token, this.#secret)
    } catch {
      return false
    }

    return true
  }
}
