/* eslint-disable no-console */
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Routers
import authRouter from './src/routers/authRouter.js';
// import usersRouter from './src/routers/usersRouter.js';
// import pagesRouter from './src/routers/pagesRouter.js';
// import notesRouter from './src/routers/notesRouter.js';

const app = express();
const PORT = process.env.PORT || 5000;


app.use((req, _res, next) => {
  console.log('[REQ]', req.method, req.url);
  next();
});


// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------
// Middleware
// --------------------

// CORS must come before routes
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,               // allow cookies
}));

app.use(express.json());    // parse JSON body
app.use(cookieParser());    // parse cookies

// --------------------
// Routes
// --------------------

// Mount routers
app.use('/api/auth', authRouter);
// app.use('/api/users', usersRouter);
// app.use('/api', pagesRouter);
// app.use('/api/notes', notesRouter);

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Serve static files if folder exists
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
