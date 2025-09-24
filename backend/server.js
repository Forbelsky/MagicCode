/* eslint-disable no-console */
require('dotenv').config()
require('dotenv').config({ path: './.env' })

const express = require('express')
const cors = require('cors')
const path = require('path')

// Routers
const authRouter = require('./src/routers/authRouter.js')
const usersRouter = require('./src/routers/usersRouter.js')
const pagesRouter = require('./src/routers/pagesRouter.js')
const notesRouter = require('./src/routers/notesRouter.js')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Mount routers (sjednoceno pod /api)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api', pagesRouter)
app.use('/api/notes', notesRouter)

// Optional: serve static demo or frontend build if exists
const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir))

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }))
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Start
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
})
