import crypto from 'node:crypto'

import express from 'express'
import type { Request } from 'express'
import jwt from 'jsonwebtoken'
import { RateLimiterRes } from 'rate-limiter-flexible'


export const createLoginRouter = (
  secret: string,
  passwordHash: string,
  maxConsecutiveFailsByIp: number,
  limiterConsecutiveFailsByIp,
) => {
  const loginRouter = express.Router()

  loginRouter.post('/', async (req, res) => {
    const ipAddr = req.ip
    if (ipAddr === undefined) {
      console.error('ERROR: IP address not set in the request')
      res.status(500).send('Internal server error')
      return
    }

    const rlResIp = await limiterConsecutiveFailsByIp.get(ipAddr)

    if (rlResIp !== null && rlResIp.consumedPoints > maxConsecutiveFailsByIp) {
      const retrySecs = Math.round(rlResIp.msBeforeNext / 1000) || 1
      res.set('Retry-After', String(retrySecs))
      res.status(429).send('Too many login attempts')
      return
    } else {
      if (typeof req.body !== 'object') {
        res.status(400).send('Request body should be JSON object')
        return
      }

      if (typeof req.body.password !== 'string') {
        res.status(400).send('Request body should contain "password" field of string type')
        return
      }

      if (req.body.password.length < 5 || req.body.password.length > 50) {
        res.status(400).send('Password should be 5-50 characters')
        return
      }

      const [salt, key] = passwordHash.split(':')
      const hash = crypto.scryptSync(req.body.password, salt, 64).toString('hex')
      if (!crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(key, 'hex'))) {
        try {
          await limiterConsecutiveFailsByIp.consume(ipAddr)
          res.status(401).send('Incorrect password')
          return
        } catch (rlRejected) {
          if (rlRejected instanceof RateLimiterRes) {
            res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000) || 1))
            res.status(429).send('Too many login attempts')
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

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

export const isLoggedIn = (req: Request, secret: string) => {
  try {
    jwt.verify(getTokenFrom(req), secret)
  } catch {
    return false
  }

  return true
}
