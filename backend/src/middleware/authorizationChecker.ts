import type { RequestHandler } from 'express'

import { getTokenFrom } from '../utils/auth/utils.ts'


const createAuthorizationChecker = (isTokenValid: (token: string) => boolean) => {
  const authorizationChecker: RequestHandler = (req, res, next) => {
    const token = getTokenFrom(req)
    if (token === null || !isTokenValid(token)) {
        res.status(401).json({ error: 'Not authorized to access this URL' })
        return
    }

    next()
  }

  return authorizationChecker
}


export default createAuthorizationChecker
