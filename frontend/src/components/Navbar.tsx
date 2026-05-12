import React, { useEffect, useRef, useState } from 'react'
import { LogOut, Moon, Sun, User } from 'lucide-react'

interface NavbarProps {
  isDarkMode?: boolean
  onThemeToggle?: (isDark: boolean) => void
  onLogout?: () => void | Promise<void>
  isLoggingOut?: boolean
  currentUser?: {
    name: string
    email: string
  } | null
}

const Navbar: React.FC<NavbarProps> = ({
  isDarkMode = false,
  onThemeToggle,
  onLogout,
  isLoggingOut = false,
  currentUser
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  const handleThemeToggle = () => {
    onThemeToggle?.(!isDarkMode)
  }

  useEffect(() => {
    if (!showProfileMenu) {
      return
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [showProfileMenu])

  const navClass = isDarkMode
    ? 'border-zinc-950 bg-[#121212] text-zinc-100'
    : 'border-zinc-200 bg-white text-zinc-950'
  const iconButtonClass = isDarkMode
    ? 'border-zinc-800 bg-[#181818] text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white'
    : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950'
  const dropdownClass = isDarkMode
    ? 'border-zinc-800 bg-[#181818] text-zinc-100 shadow-black/30'
    : 'border-zinc-200 bg-white text-zinc-950 shadow-zinc-200/80'
  const dropdownBorderClass = isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
  const mutedClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
  const menuItemClass = isDarkMode
    ? 'text-zinc-100 hover:bg-zinc-800'
    : 'text-zinc-800 hover:bg-zinc-50'

  return (
    <nav
      className={`flex h-16 items-center justify-between border-b px-5 ${navClass}`}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">Taskma</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleThemeToggle}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${iconButtonClass}`}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <a
          href="https://github.com/devsterdev/Taskma"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${iconButtonClass}`}
          title="Visit GitHub"
          aria-label="Visit GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
          </svg>
        </a>

        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${iconButtonClass}`}
            title="Profile menu"
            aria-label="Profile menu"
            aria-expanded={showProfileMenu}
          >
            <User size={18} />
          </button>

          {showProfileMenu && (
            <div
              className={`absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-lg border shadow-lg ${dropdownClass}`}
            >
              <div className={`border-b px-4 py-3 ${dropdownBorderClass}`}>
                <p className="truncate text-sm font-semibold">{currentUser?.name || 'User'}</p>
                <p className={`truncate text-xs ${mutedClass}`}>{currentUser?.email || 'No email found'}</p>
              </div>

              <button
                type="button"
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${menuItemClass}`}
              >
                View Profile
              </button>
              <button
                type="button"
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${menuItemClass}`}
              >
                Settings
              </button>
              <button
                type="button"
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${menuItemClass}`}
              >
                Help
              </button>

              <button
                type="button"
                onClick={onLogout}
                disabled={isLoggingOut}
                className={`flex w-full items-center gap-2 border-t px-4 py-3 text-left text-sm transition-colors ${
                  isDarkMode
                    ? 'border-zinc-800 text-red-300 hover:bg-zinc-800'
                    : 'border-zinc-200 text-red-600 hover:bg-red-50'
                } disabled:cursor-not-allowed disabled:opacity-70`}
              >
                <LogOut size={15} />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
