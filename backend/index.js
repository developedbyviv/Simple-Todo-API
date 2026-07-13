const express = require('express')
const { Pool } = require('pg')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC')
  res.json(result.rows)
})

app.post('/todos', async (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'title is required' })
  const result = await pool.query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING *', [title]
  )
  res.status(201).json(result.rows[0])
})

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params
  const result = await pool.query(
    'UPDATE todos SET completed = true WHERE id = $1 RETURNING *', [id]
  )
  if (result.rows.length === 0) return res.status(404).json({ error: 'Todo not found' })
  res.json(result.rows[0])
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Todo API running on port ${PORT}`))
