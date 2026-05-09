import React, { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { apiCall } from '../../utils/api'

interface CurrentUser {
  name: string
  email: string
}

const SignupPage = ({
  setCurrentPage,
  setCurrentUser
}: {
  setCurrentPage: (page: 'home' | 'auth') => void
  setCurrentUser: (user: CurrentUser | null) => void
}) => {
  const [isSignup, setIsSignup] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        localStorage.setItem("accessToken", data.accessToken);
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
        localStorage.setItem("accessToken", data.accessToken);
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Taskma</h1>
          <p className="text-gray-600">{isSignup ? 'Create your account' : 'Welcome back'}</p>
        </div>

        {/* Form Container */}
        <div className="border-2 border-black rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field - Only for Signup */}
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-black font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-black" size={20} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-2 border-2 ${
                      errors.name ? 'border-red-500' : 'border-black'
                    } rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder-gray-500`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            {/* Gender Field - Only for Signup */}
            {isSignup && (
              <div>
                <label htmlFor="gender" className="block text-black font-medium mb-2">
                  Gender <span className='text-[10px]'>*optional</span>
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    className={`w-full pl-4 pr-4 py-2 border-2 ${
                      errors.gender ? 'border-red-500' : 'border-black'
                    } rounded-lg focus:outline-none focus:border-black bg-white text-black`}
                  >
                    <option value="">Select your gender</option>
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-black font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-black" size={20} />
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
                  className={`w-full pl-10 pr-4 py-2 border-2 ${
                    errors.email ? 'border-red-500' : 'border-black'
                  } rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder-gray-500`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-black font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-black" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2 border-2 ${
                    errors.password ? 'border-red-500' : 'border-black'
                  } rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder-gray-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-black hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Field - Only for Signup */}
            {isSignup && (
              <div>
                <label htmlFor="confirmPassword" className="block text-black font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-black" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`w-full pl-10 pr-10 py-2 border-2 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-black'
                    } rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder-gray-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-black hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {isSubmitting ? (isSignup ? 'Signing up...' : 'Signing in...') : (isSignup ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          {/* Toggle Between Signup/Signin */}
          <div className="mt-6 text-center border-t-2 border-black pt-6">
            <p className="text-black">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setIsSignup(!isSignup)
                  setFormData({ name: '', email: '', password: '', confirmPassword: ''})
                  setErrors({})
                }}
                className="font-bold text-black hover:text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed underline"
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>© 2026 Taskma. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
