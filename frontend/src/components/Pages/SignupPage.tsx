import React, { useEffect, useRef, useState } from 'react'
import { Check, CheckCircle2, ChevronDown, Mail, Lock, User, Eye, EyeOff, Moon, Sun } from 'lucide-react'
import { API_BASE_URL, apiCall } from '../../utils/api'

interface CurrentUser {
  name: string
  email: string
}

const SignupPage = ({
  setCurrentPage,
  setCurrentUser,
  isDarkMode,
  onThemeToggle
}: {
  setCurrentPage: (page: 'home' | 'auth') => void
  setCurrentUser: (user: CurrentUser | null) => void
  isDarkMode: boolean
  onThemeToggle: (isDark: boolean) => void
}) => {
  const [isSignup, setIsSignup] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenderOpen, setIsGenderOpen] = useState(false)
  const genderDropdownRef = useRef<HTMLDivElement>(null)

  const pageClass = isDarkMode ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-950'
  const mutedClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
  const panelClass = isDarkMode
    ? 'border-zinc-800 bg-[#121212] shadow-black/30'
    : 'border-zinc-200 bg-white shadow-zinc-200/70'
  const borderClass = isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
  const inputClass = (hasError?: boolean, paddingClass = 'pl-10 pr-4') =>
    `h-11 w-full ${paddingClass} rounded-lg border text-sm transition-colors ${
      hasError ? 'border-red-500' : borderClass
    } focus:outline-none focus:ring-2 ${
      isDarkMode
        ? 'bg-[#181818] text-white placeholder-zinc-500 focus:border-zinc-600 focus:ring-zinc-800'
        : 'bg-white text-zinc-950 placeholder-zinc-400 focus:border-zinc-400 focus:ring-zinc-100'
    }`
  const genderSelectClass = `flex h-11 w-full items-center justify-between rounded-lg border px-4 text-left text-sm transition-colors focus:outline-none focus:ring-2 ${
    errors.gender ? 'border-red-500' : borderClass
  } ${
    isDarkMode
      ? 'bg-[#181818] text-white focus:border-zinc-600 focus:ring-zinc-800'
      : 'bg-white text-zinc-950 focus:border-zinc-400 focus:ring-zinc-100'
  }`
  const genderMenuClass = `absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border py-1 shadow-xl ${
    isDarkMode
      ? 'border-zinc-800 bg-[#181818] text-white shadow-black/40'
      : 'border-zinc-200 bg-white text-zinc-950 shadow-zinc-200/80'
  }`
  const iconClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-400'
  const iconButtonClass = isDarkMode
    ? 'border-zinc-800 bg-[#181818] text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white'
    : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950'
  const submitClass = isDarkMode
    ? 'bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-500 disabled:text-zinc-900'
    : 'bg-zinc-950 text-white hover:bg-zinc-800 disabled:bg-zinc-400'
  const linkClass = isDarkMode
    ? 'font-semibold text-white hover:text-zinc-300 disabled:cursor-not-allowed disabled:text-zinc-600'
    : 'font-semibold text-zinc-950 hover:text-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-400'
  const googleButtonClass = isDarkMode
    ? 'border-zinc-700 bg-[#181818] text-zinc-100 hover:border-zinc-600 hover:bg-zinc-900'
    : 'border-zinc-200 bg-white text-zinc-950 hover:border-zinc-300 hover:bg-zinc-50'
  const segmentClass = (active: boolean) =>
    active
      ? isDarkMode
        ? 'bg-white text-zinc-950 shadow-sm'
        : 'bg-zinc-950 text-white shadow-sm'
      : isDarkMode
        ? 'text-zinc-400 hover:text-white'
        : 'text-zinc-500 hover:text-zinc-950'

const genderOptions = [
  'Male',
  'Female',
  'Non-binary',
  'Genderqueer',
  'Agender',
  'Bigender',
  'Genderfluid',
  'Two-spirit',
  'Transgender Male',
  'Transgender Female',
  'Cisgender Male',
  'Cisgender Female',
  'Androgynous',
  'Neutrois',
  'Pangender',
  'Trigender',
  'Gender nonconforming',
  'Demiboy',
  'Demigirl',
  'Gender variant',
  'Third gender',
  'Hijra',
  'Kathoey',
  "Fa'afafine",
  'Māhū',
  'Bakla',
  'Waria',
  'Xanith',
  'Mukhannathun',
  'Intersex',
  'Transmasculine',
  'Transfeminine',
  'Questioning',
  'Gender neutral',
  'Gender expansive',
  'Gender creative',
  'Gender diverse',
  'Non-binary femme',
  'Non-binary masc',
  'Demigender',
  'Apagender',
  'Graygender',
  'Polygender',
  'Omnigender',
  'Aliagender',
  'Novigender',
  'Multigender',
  'Genderflux',
  'Cassgender',
  'Maverique',
  'Prefer not to say',
  'Other'
];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
        setIsGenderOpen(false)
      }
    }

    if (isGenderOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isGenderOpen])

  const handleGenderSelect = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }))
    setErrors(prev => ({
      ...prev,
      gender: ''
    }))
    setIsGenderOpen(false)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (isSignup && !formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (isSignup && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) {
      return
    }

    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      if (isSignup) {
        await registerUser();
      } else {
        await signInUser();
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const registerUser = async () => {
    try {
      const response = await apiCall('/user/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setCurrentUser(data.user);
        setCurrentPage('home')
      } else {
        setErrors({ form: data.message || 'Registration failed. Please try again.' })
      }
    } catch (error) {
      console.error('Error during registration:', error)
      setErrors({ form: 'An error occurred. Please try again later.' })
    }
  }

  const signInUser = async () => {
    try {
      const response = await apiCall('/user/signIn', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setCurrentUser(data.user);
        setCurrentPage('home')
      } else {
        setErrors({ form: data.message || 'Sign in failed. Please try again.' })
      }
    } catch (error) {
      console.error('Error during sign in:', error)
      setErrors({ form: 'An error occurred. Please try again later.' })
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`
  }

  return (
    <div className={`min-h-screen ${pageClass} flex items-center justify-center px-4 py-8`}>
      <button
        type="button"
        onClick={() => onThemeToggle(!isDarkMode)}
        className={`absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${iconButtonClass}`}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden lg:block">
          <div className="mb-6 flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${isDarkMode ? 'bg-white text-black' : 'bg-zinc-950 text-white'}`}>
              <CheckCircle2 size={23} />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-7">Taskma</h1>
              <p className={`text-sm ${mutedClass}`}>Your tasks, ready when you are.</p>
            </div>
          </div>

          <div className={`rounded-lg border p-5 ${panelClass}`}>
            <div className="mb-4 flex items-center justify-between">
              <span className={`h-3 w-24 rounded-full ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
              <span className={`h-8 w-8 rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
            </div>
            <div className="space-y-3">
              {[0, 1, 2].map(item => (
                <div
                  key={item}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${isDarkMode ? 'border-zinc-800 bg-[#181818]' : 'border-zinc-200 bg-zinc-50'}`}
                >
                  <span className={`h-5 w-5 rounded-full ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`} />
                  <div className="flex-1">
                    <span className={`mb-2 block h-3 w-4/5 rounded-full ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
                    <span className={`block h-2.5 w-2/5 rounded-full ${isDarkMode ? 'bg-zinc-900' : 'bg-zinc-100'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`w-full rounded-lg border p-5 shadow-xl sm:p-7 ${panelClass}`}>
          <div className="mb-6 text-center lg:hidden">
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${isDarkMode ? 'bg-white text-black' : 'bg-zinc-950 text-white'}`}>
              <CheckCircle2 size={25} />
            </div>
            <h1 className="mb-1 text-3xl font-bold">Taskma</h1>
            <p className={`text-sm ${mutedClass}`}>{isSignup ? 'Create your account' : 'Welcome back'}</p>
          </div>

          <div className="mb-5">
            <div className={`grid grid-cols-2 rounded-lg p-1 ${isDarkMode ? 'bg-black' : 'bg-zinc-100'}`}>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setIsSignup(true)
                  setFormData({ name: '', email: '', password: '', confirmPassword: '', gender: '' })
                  setIsGenderOpen(false)
                  setErrors({})
                }}
                className={`h-10 rounded-md text-sm font-semibold transition-colors ${segmentClass(isSignup)}`}
              >
                Sign up
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setIsSignup(false)
                  setFormData({ name: '', email: '', password: '', confirmPassword: '', gender: '' })
                  setIsGenderOpen(false)
                  setErrors({})
                }}
                className={`h-10 rounded-md text-sm font-semibold transition-colors ${segmentClass(!isSignup)}`}
              >
                Sign in
              </button>
            </div>
          </div>

          <div className="mb-5 hidden lg:block">
            <h2 className="text-2xl font-bold">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              {isSignup ? 'Use Google or your email to start.' : 'Use Google or your email to continue.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className={`mb-5 flex h-11 w-full items-center justify-center gap-3 rounded-lg border px-4 text-sm font-semibold transition-colors ${googleButtonClass}`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
              G
            </span>
            Continue with Google
          </button>

          <div className="mb-5 flex items-center gap-3">
            <span className={`h-px flex-1 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-300'}`} />
            <span className={`text-xs font-semibold uppercase ${mutedClass}`}>or</span>
            <span className={`h-px flex-1 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-300'}`} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field - Only for Signup */}
            {isSignup && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                    Full name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} size={18} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={inputClass(Boolean(errors.name))}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="gender" className="mb-1.5 block text-sm font-medium">
                    Gender <span className={mutedClass}>optional</span>
                  </label>
                  <div ref={genderDropdownRef} className="relative">
                    <button
                      id="gender"
                      type="button"
                      onClick={() => setIsGenderOpen(prev => !prev)}
                      className={genderSelectClass}
                      aria-haspopup="listbox"
                      aria-expanded={isGenderOpen}
                    >
                      <span className={formData.gender ? '' : mutedClass}>
                        {formData.gender || 'Select'}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 transition-transform ${isGenderOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isGenderOpen && (
                      <div className={genderMenuClass} role="listbox" aria-labelledby="gender">
                        <button
                          type="button"
                          onClick={() => handleGenderSelect('')}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                            isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                          }`}
                          role="option"
                          aria-selected={formData.gender === ''}
                        >
                          Select
                          {formData.gender === '' && <Check size={15} />}
                        </button>
                        {genderOptions.map(option => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleGenderSelect(option)}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                              isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                            }`}
                            role="option"
                            aria-selected={formData.gender === option}
                          >
                            {option}
                            {formData.gender === option && <Check size={15} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  inputMode="email"
                  autoComplete="email"
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  placeholder="Enter your email"
                  className={inputClass(Boolean(errors.email))}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={inputClass(Boolean(errors.password), 'pl-10 pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconClass} hover:opacity-75`}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password Field - Only for Signup */}
            {isSignup && (
              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={inputClass(Boolean(errors.confirmPassword), 'pl-10 pr-10')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconClass} hover:opacity-75`}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {errors.form && (
              <p className={`rounded-lg border px-3 py-2 text-sm ${isDarkMode ? 'border-red-900/60 bg-red-950/30 text-red-300' : 'border-red-200 bg-red-50 text-red-600'}`}>
                {errors.form}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`h-11 w-full rounded-lg px-4 text-sm font-bold transition-colors disabled:cursor-not-allowed ${submitClass}`}
            >
              {isSubmitting ? (isSignup ? 'Signing up...' : 'Signing in...') : (isSignup ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          {/* Toggle Between Signup/Signin */}
          <div className={`mt-5 border-t pt-5 text-center text-sm ${borderClass}`}>
            <p className={mutedClass}>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setIsSignup(!isSignup)
                  setFormData({ name: '', email: '', password: '', confirmPassword: '', gender: '' })
                  setIsGenderOpen(false)
                  setErrors({})
                }}
                className={linkClass}
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-6 text-center text-sm ${mutedClass}`}>
          <p>© 2026 Taskma. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
