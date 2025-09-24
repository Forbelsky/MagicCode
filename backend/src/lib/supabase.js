// src/lib/supabase.js
// Backend Supabase client using dynamic import (ESM-only package in CommonJS project)
let cachedClient = null

async function getSupabase() {
  if (cachedClient) return cachedClient
  const { createClient } = await import('@supabase/supabase-js')

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables')
  }

  cachedClient = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  return cachedClient
}

module.exports = { getSupabase }
