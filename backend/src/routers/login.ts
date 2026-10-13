import crypto from 'node:crypto'

import express from 'express'
import type { Request } from 'express'
import jwt from 'jsonwebtoken'

import { LoginPassword } from '../validation.ts'
import type { RateLimiter } from '../utils/ratelimiter/RateLimiter.ts'


export const createLoginRouter = (
  secret: string,
  passwordHash: string,
  limiterConsecutiveFailsByIp: RateLimiter,
) => {
  const loginRouter = express.Router()

  loginRouter.post('/', async (req, res) => {
    const ipAddr = req.ip
    if (ipAddr === undefined) {
      console.error('ERROR: IP address not set in the request')
      res.status(500).json({ error: 'Internal server error' })
      return
    }

    const rlInfo = await limiterConsecutiveFailsByIp.getInfo(ipAddr)

    if (rlInfo.isAboveLimit) {
      res.set('Retry-After', String(rlInfo.retrySecs))
      res.status(429).json({ error: 'Too many login attempts' })
      return
    } else {
      const validatedBody = LoginPassword.safeParse(req.body)

      if (!validatedBody.success) {
        res.status(400).json({
          error: 'Invalid request body',
          details: validatedBody.error.issues.map(issue => ({
            field: ['body', ...issue.path].join('.'),
            message: issue.message,
          })),
        })
        return
      }

      const [salt, key] = passwordHash.split(':')
      if (salt === undefined || key === undefined) {
        console.error('ERROR: Invalid password hash')
        res.status(500).json({ error: 'Internal server error' })
        return
      }

      const hash = crypto
        .scryptSync(validatedBody.data.password, Buffer.from(salt, 'hex'), 64)
        .toString('hex')
      if (!crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(key, 'hex'))) {
        const rlInfo = await limiterConsecutiveFailsByIp.consume(ipAddr)

        if (rlInfo.isAboveLimit) {
          res.set('Retry-After', String(rlInfo.retrySecs))
          res.status(429).json({ error: 'Too many login attempts' })
          return
        } else {
          res.status(401).json({ error: 'Incorrect password' })
          return
        }
      }

      if (rlInfo.consumedPoints > 0) {
        await limiterConsecutiveFailsByIp.reset(ipAddr)
      }

      res.json({ token: jwt.sign({}, secret) })
    }
  })

  return loginRouter
}

const getTokenFrom = (req: Request) => {
  const authorization = req.get('authorization')
  if (authorization?.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

export const isLoggedIn = (req: Request, secret: string) => {
  const token = getTokenFrom(req)
  if (!token) {
    return false
  }

  try {
    jwt.verify(token, secret)
  } catch {
    return false
  }

  return true
}
