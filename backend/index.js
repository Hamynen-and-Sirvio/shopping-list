import Database from 'better-sqlite3'
import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'

const PORT = process.env.PORT
const HOST = process.env.HOST

process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())

const db = new Database(':memory:')
db.pragma('journal_mode = WAL')
db.prepare('CREATE TABLE entries (id INTEGER PRIMARY KEY, position INTEGER NOT NULL CHECK (position >= 1), content TEXT NOT NULL)').run()

const app = express()

app.use(morgan('combined'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('DO NOT USE ROOT PATH')
})

app.get('/entries', (req, res) => {
  const rows = db.prepare('SELECT * FROM entries').all()
  const entries = rows.map(row => { return {
    id: row.id,
    position: row.position,
    content: row.content,
  }})
  res.json(entries)
})

app.post('/entries', async (req, res) => {
  const entry = req.body
  const row = db.prepare(
    'INSERT INTO entries (position, content) VALUES (COALESCE((SELECT MAX(position) + 1 FROM entries), 1), ?) RETURNING *',
  ).get(entry.content)
  res.status(201).json({ id: row.id, position: row.position, content: row.content })
})

app.delete('/entries/:id', async (req, res) => {
  const id = req.params.id
  const row = db.prepare('DELETE FROM entries WHERE id = ? RETURNING *').get(id)
  db.prepare('UPDATE entries SET position = position - 1 WHERE position > ?').run(id)
  res.status(200).json({ id: row.id, position: row.position, content: row.content })
})

app.listen(PORT, HOST, () => {
  console.log(`Server running on 'http://${HOST}:${PORT}'`)
})
