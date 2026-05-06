import { useState, useEffect } from 'react'
import Home from './components/Pages/Home'
import SignupPage from './components/Pages/SignupPage'
import { apiCall } from './utils/api'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth'>('auth')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken')
    if (token) {
      setCurrentPage('home')
    } else {
      setCurrentPage('auth')
    }
    setIsLoading(false)
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
