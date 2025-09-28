// services/authService.js
import {
  findByUsername,
  findById,
  saveSessionToken,
  deleteSessionToken
} from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const tokenStore = new Map();

function makeToken() {
  return crypto.randomBytes(24).toString('hex');
}

export async function hashPassword(plain) {
  const saltRounds = 12;
  return await bcrypt.hash(plain, saltRounds);
}

export async function verifyPassword(plain, hash) {
  if (!hash) return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

export async function login({ username, password }) {
  const user = await findByUsername(username);
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const token = makeToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await saveSessionToken(token, user.id, expiresAt);
  tokenStore.set(token, user.id);

  // vracíme jen veřejná data
  return { token, user: user.toPublicJSON() };
}

export async function logout(token) {
  tokenStore.delete(token);
  await deleteSessionToken(token);
}

export async function getUserFromToken(token) {
  let userId = tokenStore.get(token);
  if (!userId) {
    // případně načíst z DB pomocí findUserIdByToken
    return null;
  }

  const user = await findById(userId);
  return user ? user.toPublicJSON() : null;
}
