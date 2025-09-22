import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { MealProvider } from './context/MealContext'
import { MenuProvider } from './context/MenuContext'
import { FeedbackProvider } from './context/FeedbackContext'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { Smartphone } from 'lucide-react' // ADD THIS IMPORT

import Navbar from './components/Navbar'
import Home from './pages/Home'
import MealSelection from './pages/MealSelection'
import MealDetail from './pages/MealDetail'
import Feedback from './pages/Feedback'
import Auth from './pages/Auth'
import Splash from './pages/Splash'
import Onboarding from './pages/Onboarding'
import Profile from './pages/Profile'

// Mobile Restricted Route Component
const MobileRestrictedRoute = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      if (mobile) {
        // If mobile, redirect to home after a short delay
        const timer = setTimeout(() => {
          navigate('/', { replace: true })
        }, 100)
        
        return () => clearTimeout(timer)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [navigate])

  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mobile Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            Meal selection is currently only available on desktop devices. 
            Please visit this page on a computer or tablet to make your meal selections.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    )
  }

  return children
}

// Protected Route Component that redirects to home if trying to access protected routes directly
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth()
  const location = useLocation()
  
  // If not authenticated, redirect to auth
  if (!currentUser) {
    return <Navigate to="/auth" replace />
  }
  
  // If authenticated but trying to access a protected route directly, allow it
  return children
}

// Public Route Component that redirects to home if already logged in
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth()
  
  if (currentUser) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// Route handler to ensure home is always default for logged-in users
const RouteHandler = () => {
  const { currentUser } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Redirect logged-in users to home if they try to access auth
  if (currentUser && location.pathname === '/auth') {
    return <Navigate to="/" replace />
  }

  // Redirect mobile users from selection page to home
  useEffect(() => {
    if (location.pathname === '/selection' && window.innerWidth < 768) {
      navigate('/', { replace: true })
    }
  }, [location.pathname, navigate])

  // For all other cases, render the appropriate route
  return (
    <Routes>
      {/* Home is always the default and landing page for logged-in users */}
      <Route path="/" element={
        currentUser ? <Home /> : <Navigate to="/auth" replace />
      } />
      
      {/* Auth route - only accessible when not logged in */}
      <Route path="/auth" element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      } />
      
      {/* Protected routes - require authentication */}
      <Route path="/selection" element={
        <ProtectedRoute>
          
            <MealSelection />
         
        </ProtectedRoute>
      } />
      
      <Route path="/meal/:id" element={
        <ProtectedRoute>
          <MealDetail />
        </ProtectedRoute>
      } />
      
      <Route path="/feedback" element={
        <ProtectedRoute>
          <Feedback />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Redirect any unknown routes to appropriate page */}
      <Route path="*" element={
        currentUser ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />
      } />
    </Routes>
  )
}

// Main App Component
function AppContent() {
  const { currentUser, loading } = useAuth()
  const [showSplash, setShowSplash] = useState(true)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize app state
  useEffect(() => {
    const initializeApp = () => {
      // Check if user has completed onboarding
      const onboardingCompleted = localStorage.getItem('hasCompletedOnboarding') === 'true'
      setHasCompletedOnboarding(onboardingCompleted)
      
      // Hide splash after 2 seconds
      const splashTimer = setTimeout(() => {
        setShowSplash(false)
        setIsInitializing(false)
      }, 2000)

      return () => clearTimeout(splashTimer)
    }

    initializeApp()
  }, [])

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true')
    setHasCompletedOnboarding(true)
  }

  // Show loading while auth is initializing
  if (loading || isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show splash screen ONLY for first-time users who haven't completed onboarding
  if (showSplash && !hasCompletedOnboarding && !currentUser) {
    return <Splash onComplete={() => setShowSplash(false)} />
  }

  // Show onboarding AFTER splash for first-time users
  if (!hasCompletedOnboarding && !currentUser && !showSplash) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  // MAIN APP - for all authenticated users and returning users
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show navbar only for authenticated users */}
      {currentUser && <Navbar />}
      
      <main className={currentUser ? "pb-16" : ""}> {/* Add padding for mobile navbar */}
        <RouteHandler />
      </main>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <MealProvider>
          <MenuProvider>
            <FeedbackProvider>
              <AppContent />
            </FeedbackProvider>
          </MenuProvider>
        </MealProvider>
      </AuthProvider>
    </Router>
  )
}

export default App