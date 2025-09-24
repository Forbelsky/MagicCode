// src/controllers/authController.js
const { login: authLogin, logout: authLogout } = require('../services/authService.js')

function readTokenFromAuthHeader(req) {
  const auth = req.headers.authorization || ''
  const [scheme, token] = auth.split(' ')
  if (scheme && scheme.toLowerCase() === 'bearer' && token) return token
  return null
}

async function login(req, res) {
  try {
    const { username } = req.body || {}
    // eslint-disable-next-line no-console
    console.log('[controller] POST /auth/login', { username })

    const result = await authLogin({ username, password: req.body?.password })
    // eslint-disable-next-line no-console
    console.log('[controller] login success:', { userId: result?.user?.id, username: result?.user?.username })
    res.json(result) // { token, user }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[controller] login failed:', { message: e?.message })
    res.status(e.status || 500).json({ error: e.message || 'Login failed' })
  }
}

async function logout(req, res) {
  try {
    const token = readTokenFromAuthHeader(req)
    await authLogout(token)
    res.json({ ok: true })
  } catch (e) {
    res.json({ ok: true })
  }
}

module.exports = {
  login,
  logout,
}
