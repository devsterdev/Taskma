import React, { useState } from 'react'
import { Moon, Sun, User, Github } from 'lucide-react'

interface NavbarProps {
  isDarkMode?: boolean
  onThemeToggle?: (isDark: boolean) => void
  onLogout?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode = false, onThemeToggle, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleThemeToggle = () => {
    onThemeToggle?.(!isDarkMode)
  }

  return (
    <nav
      className={`border-b-2 ${
        isDarkMode
          ? 'bg-black border-white text-white'
          : 'bg-white border-black text-black'
      } px-6 py-4 flex items-center justify-between`}
    >
      {/* Left - Logo/Title */}
      <div className="flex items-center gap-2">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
            isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
        >
          T
        </div>
        <h1 className="text-2xl font-bold">Taskma</h1>
      </div>

      {/* Right - Icons */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun size={20} className="text-black" />
          ) : (
            <Moon size={20} className="text-gray-800" />
          )}
        </button>

        {/* GitHub Icon */}
        <a
          href="https://github.com/devsterdev/Taskma"
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Visit GitHub"
        >
          <Github size={20} />
        </a>

        {/* Profile Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="Profile menu"
          >
            <User size={20} />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${
                isDarkMode
                  ? 'bg-black border-2 border-white'
                  : 'bg-white border-2 border-black'
              }`}
            >
              <div
                className={`px-4 py-3 ${
                  isDarkMode ? 'border-b-2 border-white' : 'border-b-2 border-black'
                }`}
              >
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>John Doe</p>
                <p
                  className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  john@example.com
                </p>
              </div>

              <button
                className={`w-full text-left px-4 py-2 transition-colors ${
                  isDarkMode
                    ? 'hover:bg-white hover:text-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                View Profile
              </button>
              <button
                className={`w-full text-left px-4 py-2 transition-colors ${
                  isDarkMode
                    ? 'hover:bg-white hover:text-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                Settings
              </button>
              <button
                className={`w-full text-left px-4 py-2 transition-colors ${
                  isDarkMode
                    ? 'hover:bg-white hover:text-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                Help
              </button>

              <button
                onClick={onLogout}
                className={`w-full text-left px-4 py-3 transition-colors border-t ${
                  isDarkMode
                    ? 'border-white hover:bg-white hover:text-black text-white'
                    : 'border-black hover:bg-gray-100 text-red-600'
                }`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar