// authController.js
import * as authService from '../services/authService.js'

const isProd = process.env.NODE_ENV === 'production'

// Reusable cookie settings
const cookieOptions = {
  httpOnly: true,
  secure: isProd,                          // true only on HTTPS/production
  sameSite: isProd ? 'None' : 'Lax',        // cross-site cookies need 'None'
  path: '/',                                // send for all routes
  maxAge: 24 * 60 * 60 * 1000,              // 1 day
}

export async function login(req, res) {
  console.log('authController login called')

  try {
    const { username, password } = req.body
    const { token, user } = await authService.login({ username, password })

    // ⬇️ set auth cookie
    res.cookie('token', token, cookieOptions)

    res.json({ user })
  } catch (err) {
    console.error('Login error:', err)
    res.status(err.status || 500).json({ message: err.message || 'Login failed' })
  }
}

export async function logout(req, res) {
  try {
    const token = req.cookies?.token
    console.log('cookies:', req.cookies)
    console.log('authController logout called, token:', token)

    if (token) {
      await authService.logout(token)
    }

    // remove cookie on client
    res.clearCookie('token', { path: '/' })
    res.json({ ok: true })
  } catch (err) {
    console.error('Logout error:', err)
    res.status(500).json({ message: 'Logout failed' })
  }
}
