import { API_BASE_URL } from './config.js'

/**
 * Very small fetch wrapper you can expand later.
 * Automatically includes HttpOnly cookies.
 */
export async function httpGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Accept': 'application/json' },
    credentials: 'include', //  include cookies
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function httpPost(path, body) {
  console.log('FETCH URL:', `${API_BASE_URL}${path}`);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    credentials: 'include', //  include cookies
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export async function httpDelete(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    credentials: 'include', //  include cookies
  });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  return res.json().catch(() => ({}));
}
