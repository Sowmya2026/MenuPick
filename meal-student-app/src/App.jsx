import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { MealProvider } from './context/MealContext'
import { MenuProvider } from './context/MenuContext'
import { FeedbackProvider } from './context/FeedbackContext'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'

import MainNavbar from './components/MainNavbar'
import Home from './pages/Home'
import MealSelection from './pages/MealSelection'
import MealDetail from './pages/MealDetail'
import Feedback from './pages/Feedback'
import Auth from './pages/Auth'
import Splash from './pages/Splash'
import Onboarding from './pages/Onboarding'
import Profile from './pages/Profile'
import CompleteProfile from './pages/CompleteProfile' // ADD THIS IMPORT

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

// Profile Completion Route - accessible only to authenticated users who need to complete profile
const ProfileCompletionRoute = ({ children }) => {
  const { currentUser, needsProfileCompletion } = useAuth()
  
  // If not authenticated, redirect to auth
  if (!currentUser) {
    return <Navigate to="/auth" replace />
  }
  
  // If profile is already completed, redirect to home
  if (!needsProfileCompletion) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// Route handler to ensure home is always default for logged-in users
const RouteHandler = () => {
  const { currentUser, needsProfileCompletion } = useAuth()
  const location = useLocation()

  // Redirect logged-in users who need profile completion
  if (currentUser && needsProfileCompletion && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />
  }

  // Redirect logged-in users to home if they try to access auth
  if (currentUser && location.pathname === '/auth') {
    return <Navigate to="/" replace />
  }

  // Redirect users with completed profile away from complete-profile page
  if (currentUser && !needsProfileCompletion && location.pathname === '/complete-profile') {
    return <Navigate to="/" replace />
  }

  // For all other cases, render the appropriate route
  return (
    <Routes>
      {/* Public home page for guests */}
      <Route path="/home" element={<Home />} />

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
      
      {/* Profile completion route - only for users who need to complete profile */}
      <Route path="/complete-profile" element={
        <ProfileCompletionRoute>
          <CompleteProfile />
        </ProfileCompletionRoute>
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
  const { currentUser, loading, needsProfileCompletion } = useAuth()
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

  // Don't show splash/onboarding for users who need profile completion
  if (currentUser && needsProfileCompletion) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hide navbar for profile completion to focus user on the task */}
        <main>
          <RouteHandler />
        </main>
        <Toaster position="top-right" />
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
      {/* Show navbar for both authenticated and non-authenticated users */}
      <MainNavbar />
      
      <main className={currentUser ? "container mx-auto px-4 py-6" : ""}>
        <RouteHandler />
      </main>
      
      <Toaster position="top-right" />
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