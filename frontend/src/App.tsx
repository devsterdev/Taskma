import { useState } from 'react'
import Home from './components/Pages/Home'
import SignupPage from './components/Pages/SignupPage'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth'>('auth')

  return (
    <div>
      {/* {currentPage === 'auth' ? (
        <SignupPage />
      ) : (
        <Home />
      )} */}
      <Home />
    </div>
  )
}

export default App
