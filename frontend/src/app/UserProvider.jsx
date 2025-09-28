// src/app/UserProvider.jsx
import { createContext, useContext } from 'react';
import { useUser } from '../hooks/useUser.js';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const userState = useUser();
  return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be used within <UserProvider>');
  return ctx;
}
