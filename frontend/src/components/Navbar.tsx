import React, { useState } from 'react'
import { Github, LogOut, Moon, Sun, User } from 'lucide-react'

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

  const handleThemeToggle = () => {
    onThemeToggle?.(!isDarkMode)
  }

  const navClass = isDarkMode
    ? 'border-zinc-950 bg-[#121212] text-zinc-100'
    : 'border-zinc-200 bg-white text-zinc-950'
  const logoClass = isDarkMode
    ? 'bg-zinc-100 text-zinc-950'
    : 'bg-zinc-950 text-white'
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
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-base font-semibold ${logoClass}`}
        >
          T
        </div>
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
          <Github size={18} />
        </a>

        <div className="relative">
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
