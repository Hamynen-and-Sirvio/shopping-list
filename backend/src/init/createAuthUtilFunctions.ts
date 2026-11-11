import { JwtAuthorizationManager } from '../utils/auth/JwtAuthorizationManager.ts'
import { scryptHashMatches } from '../utils/password.ts'
import type { PasswordHash } from '../utils/password.ts'


export const createAuthUtilFunctions = (secretKey: Buffer, passwordHash: PasswordHash) => {
  const authorizationManager = new JwtAuthorizationManager(secretKey)
  const generateAuthToken = () => authorizationManager.generateToken()
  const isTokenValid = (token: string) => authorizationManager.checkValidityOf(token)

  const isPasswordCorrect = (password: string) => scryptHashMatches(password, passwordHash)

  return { generateAuthToken, isTokenValid, isPasswordCorrect }
}
