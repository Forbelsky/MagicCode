import { useMemo } from 'react'
import ProfilePage from './pages/ProfilePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { useUserContext } from './app/UserProvider.jsx'

function App() {
  const { isAuthenticated } = useUserContext()

  const content = useMemo(() => {
    if (!isAuthenticated) return <LoginPage />
    return <ProfilePage />
  }, [isAuthenticated])

  return content
}

export default App
