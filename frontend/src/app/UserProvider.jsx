import { createContext, useContext } from 'react'
import { useUser as useUserHook } from '../hooks/useUser.js'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const user = useUserHook()
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUserContext() {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error('useUserContext must be used within <UserProvider>')
  }
  return ctx
}
