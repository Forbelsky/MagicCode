/**
 * useUser.js
 * Správa uživatelského stavu (profil + autentizace) na klientu.
 * - Ukládá token do localStorage (klíč 'authToken').
 * - Při startu zkusí token načíst, nastavit do API klienta a načíst profil.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { login as apiLogin, logout as apiLogout, getUser as apiGetUser, updateUser as apiUpdateUser } from '../services/userService.js'
import { setAuthToken, clearAuthToken } from '../services/apiClient.js'
import { useLocalStorage } from './useLocalStorage.js'

const TOKEN_KEY = 'authToken'

export function useUser() {
  const [token, setToken] = useLocalStorage(TOKEN_KEY, null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Při mountu nastav token do API klienta a případně načti profil
  useEffect(() => {
    if (token) {
      setAuthToken(token)
      refreshUser().catch(() => {
        // Expired/invalid token – odhlásit
        doLogout().catch(() => {})
      })
    } else {
      clearAuthToken()
      setUser(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // úmyslně jen při mountu

  const refreshUser = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const me = await apiGetUser()
      setUser(me)
      return me
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const doLogin = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const { token: t, user: u } = await apiLogin(credentials)
      if (!t) {
        throw new Error('Invalid credentials')
      }
      setToken(t)
      setAuthToken(t)
      setUser(u || null)
      return u || null
    } catch (e) {
      // Ensure we never appear logged-in on failure
      setToken(null)
      clearAuthToken()
      setUser(null)
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }, [setToken])

  const doLogout = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await apiLogout()
    } catch (e) {
      // i kdyby selhalo, lokálně odhlásíme
    } finally {
      setToken(null)
      clearAuthToken()
      setUser(null)
      setLoading(false)
    }
  }, [setToken])

  const updateProfile = useCallback(async (partial) => {
    setLoading(true)
    setError(null)
    try {
      const updated = await apiUpdateUser(partial)
      setUser(updated)
      return updated
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return useMemo(() => ({
    user,
    setUser,
    token,
    setToken,        // pokud bys chtěl token řídit zvenku
    loading,
    error,
    login: doLogin,
    logout: doLogout,
    refreshUser,
    updateProfile,
    isAuthenticated: Boolean(user && token),
  }), [user, token, loading, error, doLogin, doLogout, refreshUser, updateProfile])
}
