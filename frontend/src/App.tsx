import { useState, useEffect } from 'react'
import Home from './components/Pages/Home'
import SignupPage from './components/Pages/SignupPage'
import { apiCall } from './utils/api'

interface CurrentUser {
  name: string
  email: string
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth'>('auth')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await apiCall('/user/profile', {
          method: 'GET',
        })

        if (response.ok) {
          const data = await response.json()
          setCurrentUser(data.user)
          localStorage.setItem('currentUser', JSON.stringify(data.user))
          setCurrentPage('home')
        } else {
          localStorage.removeItem('currentUser')
          setCurrentUser(null)
          setCurrentPage('auth')
        }
      } catch (error) {
        console.error('Session validation failed:', error)
        localStorage.removeItem('currentUser')
        setCurrentUser(null)
        setCurrentPage('auth')
      } finally {
        setIsLoading(false)
      }
    }

    validateSession()
  }, [])

  const handleLogout = async () => {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)
    try {
      await apiCall('/user/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      localStorage.removeItem('currentUser')
      setCurrentUser(null)
      setCurrentPage('auth')
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {currentPage === 'auth' ? (
        <SignupPage setCurrentPage={setCurrentPage} setCurrentUser={setCurrentUser} />
      ) : (
        <Home onLogout={handleLogout} isLoggingOut={isLoggingOut} currentUser={currentUser} />
      )}
    </div>
  )
}

export default App
