// repositories/userRepository.js
import pool from '../../db/pool.js';
import User from '../entities/User.js';

async function findByUsername(username) {
  const [rows] = await pool.query(
    'SELECT id, username, password_hash FROM users WHERE username = ?',
    [username]
  );
  if (!rows.length) return null;
  return new User(rows[0]);
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, username, password_hash FROM users WHERE id = ?',
    [id]
  );
  if (!rows.length) return null;
  return new User(rows[0]);
}

async function saveSessionToken(token, userId, expiresAt) {
  await pool.query(
    `INSERT INTO sessions (session_token, user_id, expires_at)
     VALUES (?, ?, ?)`,
    [token, userId, expiresAt]
  );
}

async function deleteSessionToken(token) {
  console.log('Deleting session token:', token);
  await pool.query(
    `DELETE FROM sessions WHERE session_token = ?`,
    [token]
  );
}

async function findUserIdByToken(token) {
  const [rows] = await pool.query(
    `SELECT user_id FROM sessions 
     WHERE session_token = ? AND expires_at > NOW()`,
    [token]
  );
  if (!rows.length) return null;
  return rows[0].user_id;
}

export {
  findByUsername,
  findById,
  saveSessionToken,
  deleteSessionToken,
  findUserIdByToken
};
