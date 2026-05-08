import { useState, useEffect } from 'react'
import Home from './components/Pages/Home'
import SignupPage from './components/Pages/SignupPage'
import { apiCall } from './utils/api'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth'>('auth')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      setCurrentPage('auth')
      setIsLoading(false)
      return
    }

    const validateToken = async () => {
      try {
        const response = await apiCall('/todo/read', {
          method: 'GET',
        })

        if (response.ok) {
          setCurrentPage('home')
        } else {
          localStorage.removeItem('accessToken')
          setCurrentPage('auth')
        }
      } catch (error) {
        console.error('Token validation failed:', error)
        localStorage.removeItem('accessToken')
        setCurrentPage('auth')
      } finally {
        setIsLoading(false)
      }
    }

    validateToken()
  }, [])

  const handleLogout = async () => {
    try {
      await apiCall('/user/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      localStorage.removeItem('accessToken')
      setCurrentPage('auth')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {currentPage === 'auth' ? (
        <SignupPage setCurrentPage={setCurrentPage} />
      ) : (
        <Home onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
