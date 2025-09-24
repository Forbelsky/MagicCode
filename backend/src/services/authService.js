// services/authService.js
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { findByUsername, findById } = require('../repositories/userRepository.js')

// In-memory token store: token -> userId
const tokenStore = new Map()

function makeToken() {
  return crypto.randomBytes(24).toString('hex')
}

function detectHashAlgo(storedHash) {
  if (!storedHash) return 'none'
  if (storedHash.startsWith('$2')) return 'bcrypt'
  if (/^[a-f0-9]{64}$/i.test(storedHash)) return 'sha256'
  return 'unknown'
}

// Verify password against stored hash.
// - bcrypt (hash starts with $2)
// - legacy sha256 fallback (64 hex chars). Consider migrating to bcrypt on next login.
async function verifyPassword(plain, storedHash) {
  if (!storedHash) return false
  // bcrypt
  if (storedHash.startsWith('$2')) {
    try {
      return await bcrypt.compare(plain, storedHash)
    } catch {
      return false
    }
  }
  // legacy sha256 hex
  const sha256Hex = /^[a-f0-9]{64}$/i
  if (sha256Hex.test(storedHash)) {
    const input = crypto.createHash('sha256').update(plain, 'utf8').digest('hex')
    return crypto.timingSafeEqual(Buffer.from(input), Buffer.from(storedHash))
  }
  return false
}

/**
 * Login:
 * - Vyžaduje username a password (email se nepodporuje).
 * - Vybere uživatele z DB podle username (case-insensitive).
 * - Ověří heslo (bcrypt, případně legacy sha256).
 * - Při úspěchu vygeneruje token a uloží do tokenStore.
 */
async function login({ username, password }) {
  if (!username || !password) {
    const err = new Error('Missing credentials')
    err.status = 400
    throw err
  }

  // eslint-disable-next-line no-console
  console.log('[auth] login attempt:', { username: String(username).trim() })

  const user = await findByUsername(username)
  if (!user) {
    // eslint-disable-next-line no-console
    console.warn('[auth] user not found in DB:', { username })
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  const algo = detectHashAlgo(user.passwordHash)
  const ok = await verifyPassword(password, user.passwordHash)

  // eslint-disable-next-line no-console
  console.log('[auth] verification result:', {
    userId: user.id,
    username: user.username,
    algo,
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
  if (tokenStore.has(token)) {
    tokenStore.delete(token)
  }
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
}
