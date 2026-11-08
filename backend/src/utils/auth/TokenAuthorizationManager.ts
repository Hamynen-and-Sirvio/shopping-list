export interface TokenAuthorizationManager {
  generateToken(): string
  checkValidityOf(token: string): boolean
}
