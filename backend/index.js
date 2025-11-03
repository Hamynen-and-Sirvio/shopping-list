import crypto from 'crypto'
import Database from 'better-sqlite3'
import 'dotenv/config'
import express from 'express'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'

const PORT = process.env.PORT
const HOST = process.env.HOST
const PASSWORD_HASH = process.env.PASSWORD_HASH
const SECRET = process.env.SECRET

process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())

const db = new Database(':memory:')
db.pragma('journal_mode = WAL')
db.prepare(
  'CREATE TABLE entries (' +
  'id INTEGER PRIMARY KEY, ' +
  'position INTEGER NOT NULL CHECK (position >= 1), ' +
  'content TEXT NOT NULL, ' +
  'checked BOOLEAN NOT NULL DEFAULT 0 CHECK (checked IN (0, 1))' +
  ')'
).run()

const app = express()

app.use(morgan('combined'))
app.use(express.json())

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

app.get('/', (req, res) => {
  res.send('DO NOT USE ROOT PATH')
})

app.post('/login', (req, res) => {
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
    res.status(401).send('Incorrect password')
    return
  }

  res.json({ token: jwt.sign({}, process.env.SECRET) })
})

app.use((req, res, next) => {
  try {
    jwt.verify(getTokenFrom(req), process.env.SECRET)
  } catch {
    res.status(401).send('Not authorized to access this URL')
    return
  }

  next()
})

app.get('/entries', (req, res) => {
  const rows = db.prepare('SELECT * FROM entries ORDER BY position').all()
  const entries = rows.map(row => { return {
    id: row.id,
    position: row.position,
    content: row.content,
    checked: row.checked === 1,
  }})
  res.json(entries)
})

app.post('/entries', (req, res) => {
  const entry = req.body
  const row = db.prepare(
    'INSERT INTO entries (position, content) ' +
    'VALUES (COALESCE((SELECT MAX(position) + 1 FROM entries), 1), ?) ' +
    'RETURNING *'
  ).get(entry.content)
  res.status(201).json({ id: row.id, position: row.position, content: row.content, checked: row.checked === 1 })
})

app.delete('/entries/:id', (req, res) => {
  const id = req.params.id
  const row = db.prepare('DELETE FROM entries WHERE id = ? RETURNING *').get(id)
  db.prepare('UPDATE entries SET position = position - 1 WHERE position > ?').run(id)
  res.status(200).json({ id: row.id, position: row.position, content: row.content, checked: row.checked === 1 })
})

app.patch('/entries/:id', (req, res) => {
  const id = req.params.id
  const editedFields = req.body

  const editStatements = []
  const bindParams = []

  if (editedFields.hasOwnProperty('checked')) {
    editStatements.push('checked = ?')
    bindParams.push(editedFields.checked ? 1 : 0)
  }

  if (editedFields.hasOwnProperty('content')) {
    editStatements.push('content = ?')
    bindParams.push(editedFields.content)
  }

  if (editedFields.hasOwnProperty('position')) {
    if (editedFields.position < 1) {
      res.status(400).send('Position should be >= 1')
      return
    }

    const numOfEntries = db.prepare('SELECT COUNT(id) AS count FROM entries').get().count
    if (editedFields.position > numOfEntries) {
      res.status(400).send(`Position should be <= {numOfEntries}`)
      return
    }

    const oldPos = db.prepare('SELECT position FROM entries WHERE id = ?').get(id).position
    if (editedFields.position > oldPos) {
      db.prepare(
        'UPDATE entries SET position = position - 1 WHERE position > ? AND position <= ?'
      ).run(oldPos, editedFields.position)
    } else {
      db.prepare(
        'UPDATE entries SET position = position + 1 WHERE position >= ? AND position < ?'
      ).run(editedFields.position, oldPos)
    }

    editStatements.push('position = ?')
    bindParams.push(editedFields.position)
  }

  if (editStatements.length === 0) {
    res.status(400).send('Should edit "content" and/or "position" fields')
    return
  }

  const row = db.prepare(
    `UPDATE entries SET ${editStatements.join(', ')} WHERE id = ? RETURNING *`
  ).get(...bindParams, id)

  res.json({ id: row.id, position: row.position, content: row.content, checked: row.checked === 1 })
})

app.listen(PORT, HOST, () => {
  console.log(`Server running on 'http://${HOST}:${PORT}'`)
})
