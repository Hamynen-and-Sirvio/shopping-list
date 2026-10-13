export interface RateLimitingInfo {
  isAboveLimit: boolean
  retrySecs: number
  consumedPoints: number
}

export interface RateLimiter {
  getInfo(ipAddr: string): Promise<RateLimitingInfo>
  consume(ipAddr: string): Promise<RateLimitingInfo>
  reset(ipAddr: string): Promise<void>
}
