import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, LogIn, Sparkles, UserCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      toast.success('Logged in successfully!')
      
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 100)
      
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to log in: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Auto-fill demo credentials for testing
  const fillDemoCredentials = () => {
    setEmail('demo@admin.com')
    setPassword('demo123')
    toast.success('Demo credentials filled! Click Sign in to continue.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-green-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-sm sm:text-base text-green-700">
            Secure access to meal management system
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-6 sm:p-8"
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-3 shadow-lg mb-4"
            >
              <LogIn className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold text-green-900">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-green-600 mt-1">
              Sign in to your admin account
            </p>
          </div>

          {/* Demo Credentials Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
          >
            <p className="text-xs sm:text-sm text-green-800 text-center mb-2 font-medium flex items-center justify-center">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Demo Access
            </p>
            <div className="text-xs text-green-700 bg-white/80 p-2 rounded border border-green-100">
              <p><span className="font-medium">Email:</span> demo@admin.com</p>
              <p><span className="font-medium">Password:</span> demo123</p>
            </div>
            <motion.button
              type="button"
              onClick={fillDemoCredentials}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-medium py-2 px-2 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Auto-fill Demo Credentials
            </motion.button>
          </motion.div>

          {/* Login Form */}
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-green-200 bg-white/50 px-3 py-2.5 sm:py-3 text-sm sm:text-base text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-green-200 bg-white/50 px-3 py-2.5 sm:py-3 pr-10 text-sm sm:text-base text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-xs text-green-600 bg-white/50 rounded-lg p-2 border border-green-200/50">
            🔒 Secure admin access only. Unauthorized attempts are prohibited.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login