import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '../components/Logo'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const { login, signup, currentUser, resetPassword } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true })
    }
  }, [currentUser, navigate])

  const handleResetPassword = async () => {
    const input = username || window.prompt("Please enter your username or email to reset password:");

    if (!input) {
      toast.error("Username/Email is required to reset password");
      return;
    }

    const emailToReset = input.includes('@') ? input : `${input}@menupick.com`;

    try {
      await resetPassword(emailToReset);
      toast.success(`Password reset email sent to ${emailToReset}! Check your inbox.`);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to send reset email: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      toast.error('Please fill in all fields')
      return
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true)

    // Clean username and construct email
    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
    const finalEmail = cleanUsername.includes('@') ? cleanUsername : `${cleanUsername}@menupick.com`;

    // Validate constructed email simple check
    if (!finalEmail.includes('@') || finalEmail.endsWith('@')) {
      toast.error("Invalid username format");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login(finalEmail, password)
        toast.success('Logged in successfully!')
        // Navigation handled by useEffect
      } else {
        await signup(finalEmail, password)
        toast.success('Account created successfully!')
        // After signup, usually auto-logged in, so useEffect handles nav
      }

    } catch (error) {
      console.error('Auth error:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-6 sm:p-8"
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex justify-center mb-4">
              <Logo size="lg" withText={true} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-green-900">
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h2>
            <p className="text-xs sm:text-sm text-green-600 mt-1">
              {isLogin ? 'Sign in to your admin account' : 'Enter details to create account'}
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              {/* Username Input */}
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="w-full rounded-lg border border-green-200 bg-white/50 px-3 py-2.5 sm:py-3 text-sm sm:text-base text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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

              {/* Confirm Password Input (Only for Signup) */}
              {!isLogin && (
                <div className="relative">
                  <label htmlFor="confirmPassword" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-lg border border-green-200 bg-white/50 px-3 py-2.5 sm:py-3 text-sm sm:text-base text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-xs sm:text-sm text-green-600 hover:text-green-800 hover:underline"
                >
                  Forgot Password?
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
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                isLogin ? 'Sign in' : 'Create Account'
              )}
            </motion.button>

            {/* Toggle Login/Signup */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-green-600 hover:text-green-800 font-medium focus:outline-none transition-colors duration-200"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
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