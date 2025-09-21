import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, LogIn, Sparkles, UserCheck } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-full p-3 shadow-lg">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="bg-amber-500 rounded-full p-1 animate-pulse">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Admin Portal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Secure access to management dashboard
            </p>
            
            {/* Demo credentials hint */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl w-full">
              <p className="text-sm text-blue-800 text-center mb-2 font-medium">
                <Sparkles className="h-4 w-4 inline mr-1" />
                Demo Access
              </p>
              <div className="text-xs text-blue-700 text-center bg-white p-2 rounded-lg border border-blue-100">
                <p><span className="font-medium">Email:</span> demo@admin.com</p>
                <p><span className="font-medium">Password:</span> demo123</p>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full mt-3 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium py-2 px-2 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Auto-fill Demo Credentials
              </button>
            </div>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
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
                  className="relative block w-full rounded-b-md border-0 py-3 px-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
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
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-primary-600 to-purple-600 py-3 px-4 text-sm font-semibold text-white hover:from-primary-500 hover:to-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Secure admin access only. Unauthorized attempts are prohibited.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login