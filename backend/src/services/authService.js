// services/authService.js
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { findByUsername, findById } = require('../repositories/userRepository.js')

// In-memory token store: token -> userId
const tokenStore = new Map()

function makeToken() {
  return crypto.randomBytes(24).toString('hex')
}

// Hash a password with bcrypt (use when creating/updating users)
async function hashPassword(plain) {
  const saltRounds = 12 // adjust for desired security/performance
  return await bcrypt.hash(plain, saltRounds)
}

// Verify password strictly with bcrypt
async function verifyPassword(plain, storedHash) {
  if (!storedHash) return false
  try {
    return await bcrypt.compare(plain, storedHash)
  } catch {
    return false
  }
}

/**
 * Login:
 * - Vyžaduje username a password (email se nepodporuje).
 * - Vybere uživatele z DB podle username (case-insensitive).
 * - Ověří heslo pomocí bcrypt.
 * - Při úspěchu vygeneruje token a uloží do tokenStore.
 */
async function login({ username, password }) {
  if (!username || !password) {
    const err = new Error('Missing credentials')
    err.status = 400
    throw err
  }

  console.log('[auth] login attempt:', { username: String(username).trim() })
  
  const user = await findByUsername(username)
  if (!user) {
    console.warn('[auth] user not found in DB:', { username })
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  const ok = await verifyPassword(password, user.passwordHash)
  console.log('[auth] verification result:', {
    userId: user.id,
    username: user.username,
    ok,
  })

  if (!ok) {
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  const token = makeToken()
  tokenStore.set(token, user.id)
  return { token, user: user.toPublicJSON() }
}

async function logout(token) {
  tokenStore.delete(token)
  return { ok: true }
}

async function getUserFromToken(token) {
  const userId = tokenStore.get(token)
  if (!userId) return null
  const u = await findById(userId)
  return u ? u.toPublicJSON() : null
}

module.exports = {
  login,
  logout,
  getUserFromToken,
  hashPassword, // export for user registration/update
}
