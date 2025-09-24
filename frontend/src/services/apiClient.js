/**
 * apiClient.js
 * Jednoduchý, rozšiřitelný fetch wrapper pro volání REST API.
 * - Základní URL lze přepsat proměnnou prostředí VITE_API_BASE_URL, jinak '/api'.
 * - Automatické posílání JSON, parsování odpovědi a vyhazování smysluplných chyb.
 * - Volitelná podpora Bearer tokenu (setAuthToken/clearAuthToken).
 */

let AUTH_TOKEN = null

export function setAuthToken(token) {
  AUTH_TOKEN = token || null
}

export function clearAuthToken() {
  AUTH_TOKEN = null
}

export function getAuthToken() {
  return AUTH_TOKEN
}

const BASE_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  '/api'

async function parseResponse(res) {
  // 204 No Content / prázdná odpověď
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function buildHeaders(extra = {}) {
  const headers = new Headers({
    Accept: 'application/json',
    ...extra,
  })
  if (AUTH_TOKEN && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${AUTH_TOKEN}`)
  }
  return headers
}

export async function request(path, { method = 'GET', body, headers, signal } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  const reqInit = {
    method,
    headers: buildHeaders(
      isFormData
        ? headers
        : { 'Content-Type': 'application/json', ...(headers || {}) }
    ),
    signal,
  }

  if (body !== undefined) {
    reqInit.body = isFormData ? body : JSON.stringify(body)
  }

  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, reqInit)
  const payload = await parseResponse(res)

  if (!res.ok) {
    const message =
      (payload && (payload.message || payload.error)) ||
      res.statusText ||
      `HTTP ${res.status}`
    const err = new Error(message)
    err.status = res.status
    err.payload = payload
    throw err
  }
  return payload
}

export const get = (path, opts) => request(path, { ...opts, method: 'GET' })
export const post = (path, body, opts) => request(path, { ...opts, method: 'POST', body })
export const put = (path, body, opts) => request(path, { ...opts, method: 'PUT', body })
export const patch = (path, body, opts) => request(path, { ...opts, method: 'PATCH', body })
export const del = (path, opts) => request(path, { ...opts, method: 'DELETE' })
