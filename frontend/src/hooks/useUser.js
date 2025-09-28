import { useState, useEffect, useCallback, useMemo } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../services/userService.js';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await apiLogin(credentials); // nastaví cookie
      const u = await getCurrentUser();
      setUser(u);
      return u;
    } catch (e) {
      setUser(null);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: Boolean(user),
  }), [user, loading, error, login, logout]);
}
