/**
 * userService.js
 * Funkce související s uživatelem a autentizací.
 * Konvence endpointů (můžeš upravit dle svého backendu):
 *  - POST /auth/login       { username, password } -> { token, user }
 *  - POST /auth/logout      -> 204 / { ok: true }
 *  - GET  /users/me         -> { id, name, email?, ... }
 *  - PUT  /users/me         -> { ...updatedUser }
 */
import { get, post, put, setAuthToken, clearAuthToken } from './apiClient.js'

export async function login({ username, password }) {
  const data = await post('/auth/login', { username, password })
  if (!data?.token) {
    // Enforce strict backend-auth; do not allow frontend fallbacks
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }
  setAuthToken(data.token)
  return data
}

export async function logout() {
  try {
    await post('/auth/logout')
  } finally {
    clearAuthToken()
  }
}

export async function getUser() {
  return get('/users/me')
}

export async function updateUser(partial) {
  return put('/users/me', partial)
}
