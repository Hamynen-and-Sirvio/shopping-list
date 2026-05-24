import crypto from 'node:crypto'

import express from 'express'
import type { Request } from 'express'
import jwt from 'jsonwebtoken'
import { RateLimiterRes } from 'rate-limiter-flexible'
import type { RateLimiterAbstract} from 'rate-limiter-flexible'

import { LoginPassword } from '../validation.ts'


export const createLoginRouter = (
  secret: string,
  passwordHash: string,
  maxConsecutiveFailsByIp: number,
  limiterConsecutiveFailsByIp: RateLimiterAbstract,
) => {
  const loginRouter = express.Router()

  loginRouter.post('/', async (req, res) => {
    const ipAddr = req.ip
    if (ipAddr === undefined) {
      console.error('ERROR: IP address not set in the request')
      res.status(500).json({ error: 'Internal server error' })
      return
    }

    const rlResIp = await limiterConsecutiveFailsByIp.get(ipAddr)

    if (rlResIp !== null && rlResIp.consumedPoints > maxConsecutiveFailsByIp) {
      const retrySecs = Math.round(rlResIp.msBeforeNext / 1000) || 1
      res.set('Retry-After', String(retrySecs))
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
        try {
          await limiterConsecutiveFailsByIp.consume(ipAddr)
          res.status(401).json({ error: 'Incorrect password' })
          return
        } catch (rlRejected) {
          if (rlRejected instanceof RateLimiterRes) {
            res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000) || 1))
            res.status(429).json({ error: 'Too many login attempts' })
            return
          } else {
            throw rlRejected
          }
        }
      }

      if (rlResIp !== null && rlResIp.consumedPoints > 0) {
        await limiterConsecutiveFailsByIp.delete(ipAddr)
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
