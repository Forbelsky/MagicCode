// repositories/userRepository.js
const { getSupabase } = require('../lib/supabase.js')
const { User } = require('../entities/User.js')

// Maps a DB row to the User entity used in the app
function mapRowToUser(row) {
  if (!row) return null
  const roles = Array.isArray(row.roles) ? row.roles : ['USER'] // default roles if column doesn't exist
  const name = row.name || row.username // optional name fallback
  return new User({
    id: String(row.id),
    username: row.username,
    name,
    roles,
    passwordHash: row.password_hash, // keep private; do not send to client
  })
}

// Fetch one user by username (case-insensitive, exact string without wildcards)
async function findByUsername(username) {
  const supabase = await getSupabase()
  const normalized = String(username).trim()

  const { data, error } = await supabase
    .from('users')
    .select('id, username, password_hash, roles, name')
    .ilike('username', normalized) // exact case-insensitive match (no wildcards)
    .maybeSingle()

  // Debug logging to help verify DB access and row shape (no sensitive data)
  // eslint-disable-next-line no-console
  console.log('[findByUsername] input:', { username, normalized })
  // eslint-disable-next-line no-console
  console.log('[findByUsername] db row:', data && {
    id: data.id,
    username: data.username,
    hasHash: Boolean(data.password_hash),
    hashPreview: data.password_hash ? `${String(data.password_hash).slice(0, 12)}...` : null,
    name: data.name ?? null,
    roles: data.roles ?? null,
  })

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[findByUsername] Supabase error:', error)
    throw new Error(`DB error (findByUsername): ${error.message}`)
  }
  return mapRowToUser(data)
}

// Fetch one user by id
async function findById(id) {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('users')
    .select('id, username, roles, name')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(`DB error (findById): ${error.message}`)
  }
  return mapRowToUser(data)
}

module.exports = {
  findByUsername,
  findById,
}
