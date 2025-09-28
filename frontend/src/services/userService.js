


// userService.js
import { httpPost, httpGet } from './httpClient.js';

export async function login({ username, password }) {
  const data = await httpPost('/auth/login', { username, password });
  return data.user;
}

export async function logout() {
  await httpPost('/auth/logout', {});
}

// ⬇️ Nově přidaná funkce
export async function getCurrentUser() {
  return await httpGet('/auth/me');
}
