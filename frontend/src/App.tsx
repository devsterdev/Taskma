import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Home from './components/Pages/Home'
import { apiCall } from './utils/api'
import { getInitialTheme, THEME_STORAGE_KEY } from './utils/theme'
import SignupPage from './components/Pages/SignupPage'

interface CurrentUser {
  name: string
  email: string
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth'>('auth')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme)

 useEffect(() => {

  const validateSession = async () => {

    try {

      const response = await apiCall(
        '/user/profile',
        {
          method: 'GET',
        }
      )

      if (response.ok) {

        const data =
          await response.json()

        setCurrentUser(data.user)

        localStorage.setItem(
          'currentUser',
          JSON.stringify(data.user)
        )

        setCurrentPage('home')

      } else {

        localStorage.removeItem(
          'currentUser'
        )

        setCurrentUser(null)

        setCurrentPage('auth')
      }

    } catch (error) {

      console.error(
        'Session validation failed:',
        error
      )

      localStorage.removeItem(
        'currentUser'
      )

      setCurrentUser(null)

      setCurrentPage('auth')

    } finally {

      setIsLoading(false)
    }
  }

  const params =
    new URLSearchParams(
      window.location.search
    )

  const oauth =
    params.get("oauth")

  if (oauth === "success") {

    setTimeout(() => {

      validateSession()

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      )

    }, 200)

  } else {

    validateSession()
  }

}, [])

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

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
    const shellClass = isDarkMode
      ? 'bg-black text-zinc-100'
      : 'bg-zinc-50 text-zinc-950'
    const panelClass = isDarkMode
      ? 'border-zinc-800 bg-[#121212] shadow-black/30'
      : 'border-zinc-200 bg-white shadow-zinc-200/70'
    const softPanelClass = isDarkMode
      ? 'border-zinc-800 bg-[#181818]'
      : 'border-zinc-200 bg-zinc-50'
    const mutedBlockClass = isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'
    const faintBlockClass = isDarkMode ? 'bg-zinc-900' : 'bg-zinc-100'
    const accentClass = isDarkMode
      ? 'bg-zinc-100 text-zinc-950'
      : 'bg-zinc-950 text-white'

    return (
      <main className={`flex min-h-screen items-center justify-center px-5 ${shellClass}`}>
        <div className="w-full max-w-3xl">
          <div className="mb-7 flex items-center justify-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentClass}`}>
              <CheckCircle2 size={23} />
            </div>
            <div>
              <p className="text-xl font-semibold leading-6">Taskma</p>
              <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Getting your workspace ready
              </p>
            </div>
          </div>

          <div className={`overflow-hidden rounded-2xl border shadow-xl ${panelClass}`}>
            <div className={`flex h-14 items-center justify-between border-b px-5 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${mutedBlockClass}`} />
                <span className={`h-3 w-24 rounded-full ${mutedBlockClass}`} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-8 w-8 rounded-lg ${faintBlockClass}`} />
                <span className={`h-8 w-8 rounded-lg ${faintBlockClass}`} />
                <span className={`h-8 w-8 rounded-lg ${faintBlockClass}`} />
              </div>
            </div>

            <div className="grid min-h-72 grid-cols-[160px_1fr_180px] gap-4 p-4 max-md:grid-cols-1">
              <div className={`hidden rounded-xl border p-4 md:block ${softPanelClass}`}>
                <div className={`mb-5 h-9 w-full rounded-lg ${mutedBlockClass}`} />
                {[0, 1, 2, 3].map(item => (
                  <div key={item} className="mb-4 flex items-center gap-3">
                    <span className={`h-4 w-4 rounded ${faintBlockClass}`} />
                    <span className={`h-3 flex-1 rounded-full ${faintBlockClass}`} />
                  </div>
                ))}
              </div>

              <div className={`rounded-xl border p-4 ${softPanelClass}`}>
                <div className="mb-5 flex items-center justify-between">
                  <span className={`h-5 w-28 rounded-full ${mutedBlockClass}`} />
                  <span className={`h-8 w-8 rounded-lg ${faintBlockClass}`} />
                </div>
                {[0, 1, 2].map(item => (
                  <div
                    key={item}
                    className={`mb-3 flex items-center gap-3 rounded-lg border p-3 ${isDarkMode ? 'border-zinc-800 bg-[#121212]' : 'border-zinc-200 bg-white'}`}
                  >
                    <span className={`h-5 w-5 rounded-full ${faintBlockClass}`} />
                    <div className="flex-1">
                      <span className={`mb-2 block h-3 w-4/5 rounded-full ${mutedBlockClass}`} />
                      <span className={`block h-2.5 w-2/5 rounded-full ${faintBlockClass}`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className={`hidden rounded-xl border p-4 lg:block ${softPanelClass}`}>
                <span className={`mb-5 block h-5 w-20 rounded-full ${mutedBlockClass}`} />
                <div className="space-y-3">
                  <span className={`block h-16 rounded-lg ${faintBlockClass}`} />
                  <span className={`block h-16 rounded-lg ${faintBlockClass}`} />
                  <span className={`block h-16 rounded-lg ${faintBlockClass}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2" role="status" aria-live="polite">
            <span className={`h-2 w-2 animate-pulse rounded-full ${mutedBlockClass}`} />
            <span className={`h-2 w-2 animate-pulse rounded-full delay-150 ${mutedBlockClass}`} />
            <span className={`h-2 w-2 animate-pulse rounded-full delay-300 ${mutedBlockClass}`} />
            <span className={`ml-2 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Loading
            </span>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div>
      {currentPage === 'auth' ? (
        <SignupPage
          setCurrentPage={setCurrentPage}
          setCurrentUser={setCurrentUser}
          isDarkMode={isDarkMode}
          onThemeToggle={setIsDarkMode}
        />
      ) : (
        <Home
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
          currentUser={currentUser}
          isDarkMode={isDarkMode}
          onThemeToggle={setIsDarkMode}
        />
      )}
    </div>
  )
}

export default App
