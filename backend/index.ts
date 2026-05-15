import cors from 'cors';
import crypto from 'crypto'
import 'dotenv/config'
import express from 'express'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'
import { prisma } from './lib/prisma.ts'


const MAX_CONSECUTIVE_FAILS_BY_IP = 5

const DATABASE_URL = process.env.DATABASE_URL
if (DATABASE_URL === undefined) {
  throw new Error('Environment variable DATABASE_URL not defined');
}

if (process.env.PORT === undefined) {
  throw new Error('Environment variable PORT not defined');
}
const PORT = parseInt(process.env.PORT)

const HOST = process.env.HOST
if (HOST === undefined) {
  throw new Error('Environment variable HOST not defined');
}

const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') || false

const PASSWORD_HASH = process.env.PASSWORD_HASH
if (PASSWORD_HASH === undefined) {
  throw new Error('Environment variable PASSWORD_HASH not defined');
}

const SECRET = process.env.SECRET
if (SECRET === undefined) {
  throw new Error('Environment variable SECRET not defined');
}

process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())

const app = express()

app.use(morgan('combined'))
app.use(cors({ origin: CORS_ORIGINS }))
app.use(express.json())

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const limiterConsecutiveFailsByIp = new RateLimiterMemory({
  points: MAX_CONSECUTIVE_FAILS_BY_IP,
  duration: 60 * 60 * 3,
  blockDuration: 60 * 15,
})

app.get('/', (req, res) => {
  res.send('DO NOT USE ROOT PATH')
})

app.post('/login', async (req, res) => {
  const ipAddr = req.ip
  if (ipAddr === undefined) {
    console.error('ERROR: IP address not set in the request')
    res.status(500).send('Internal server error')
    return
  }

  const rlResIp = await limiterConsecutiveFailsByIp.get(ipAddr)

  if (rlResIp !== null && rlResIp.consumedPoints > MAX_CONSECUTIVE_FAILS_BY_IP) {
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

    const password = Uint8Array.from(Buffer.from(req.body.password, 'base64').toString('binary'), c => c.charCodeAt(0))
    const [salt, key] = PASSWORD_HASH.split(':')
    const hash = crypto.scryptSync(password, salt, 64).toString('hex')
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

    res.json({ token: jwt.sign({}, SECRET) })
  }
})

app.use((req, res, next) => {
  try {
    jwt.verify(getTokenFrom(req), SECRET)
  } catch {
    res.status(401).send('Not authorized to access this URL')
    return
  }

  next()
})

app.get('/entries', async (req, res) => {
  const entries = await prisma.entries.findMany({ orderBy: { position: 'asc' } })
  res.json(entries)
})

app.post('/entries', async (req, res) => {
  const entry = req.body

  const addedEntry = await prisma.$transaction(async (tx) => {
    const entryCount = await tx.entries.count()

    return tx.entries.create({
      data: {
        position: entryCount + 1,
        content: entry.content,
      },
    })
  })

  res.status(201).json(addedEntry)
})

app.delete('/entries/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  const deletedEntry = await prisma.$transaction(async (tx) => {
    const deletedEntry = await tx.entries.delete({
      where: {
        id: id,
      },
    })

    await tx.entries.updateMany({
      where: { position: { gt: deletedEntry.position } },
      data: { position: { decrement: 1 } },
    })

    return deletedEntry
  })

  res.status(200).json(deletedEntry)
})

app.patch('/entries/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const editedFields = req.body

  if (!editedFields.hasOwnProperty('content') &&
      !editedFields.hasOwnProperty('position') &&
      !editedFields.hasOwnProperty('checked')) {
    res.status(400).send('Should edit at least one of the fields')
    return
  }

  if (editedFields.hasOwnProperty('position') && editedFields.position < 1) {
      res.status(400).send('Position should be >= 1')
      return
  }

  try {
    const editedEntry = await prisma.$transaction(async (tx) => {
      const oldEntry = await tx.entries.findUnique({ where: { id: id } })
      if (!oldEntry) {
        res.status(404).send('Entry not found')
        throw ''
      }

      if (editedFields.hasOwnProperty('position')) {
        const numOfEntries = await tx.entries.count()
        if (editedFields.position > numOfEntries) {
          res.status(400).send(`Position should be <= ${numOfEntries}`)
          throw ''
        }

        const oldPos = oldEntry.position
        if (editedFields.position > oldPos) {
          await tx.entries.updateMany({
            where: {
              AND: [
                { position: { gt: oldPos } },
                { position: { lte: editedFields.position } },
              ],
            },
            data: { position: { decrement: 1 } },
          })
        } else {
          await tx.entries.updateMany({
            where: {
              AND: [
                { position: { gte: editedFields.position } },
                { position: { lt: oldPos } },
              ],
            },
            data: { position: { increment: 1 } },
          })
        }
      }

      return tx.entries.update({
        where: { id: id },
        data: editedFields,
      })
    })

    res.json(editedEntry)
  } catch (error) {
    if (error !== '') {
      throw error
    }
  }
})

app.listen(PORT, HOST, () => {
  console.log(`Server running on 'http://${HOST}:${PORT}'`)
})
