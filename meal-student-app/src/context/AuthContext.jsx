import { createContext, useState, useEffect, useContext } from 'react'
import { authService } from '../services/authService'
import { 
  getFirestore, 
  doc, 
  getDoc
} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const db = getFirestore()
  const navigate = useNavigate()

  // Get user profile from Firestore
  const getUserProfile = async (uid) => {
    try {
      console.log('📖 Getting user profile from Firestore...')
      const userDoc = await getDoc(doc(db, 'users', uid))
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        console.log('✅ User profile found:', data)
        
        if (data.needsProfileCompletion) {
          console.log('🔄 User needs profile completion')
          setNeedsProfileCompletion(true)
        } else {
          setNeedsProfileCompletion(false)
        }
        return data
      }
      console.log('❌ User profile not found in Firestore')
      return null
    } catch (error) {
      console.error('❌ Error getting user profile:', error)
      setAuthError('Failed to load user profile')
      return null
    }
  }

  const updateUserProfile = async (updates) => {
    if (!currentUser) return { success: false, error: 'No user logged in' }
    
    try {
      const result = await authService.completeGoogleProfile(currentUser.uid, updates)
      if (result.success) {
        setCurrentUser(prev => ({ ...prev, ...updates, isRegistered: true, needsProfileCompletion: false }))
        setNeedsProfileCompletion(false)
      }
      return result
    } catch (error) {
      console.error('❌ Error updating user profile:', error)
      return { success: false, error: error.message }
    }
  }

  const loginWithGoogle = async () => {
    setAuthError(null)
    setNeedsProfileCompletion(false)
    setAuthLoading(true)
    
    try {
      const result = await authService.loginWithGoogle()
      
      if (result.success && result.user) {
        console.log('✅ Auth successful, loading user profile...')
        
        const userProfile = await getUserProfile(result.user.uid)
        
        if (userProfile) {
          setCurrentUser({ ...result.user, ...userProfile })
          
          if (result.needsProfileCompletion) {
            setNeedsProfileCompletion(true)
            navigate('/complete-profile')
          } else {
            navigate('/')
          }
        } else {
          setAuthError('Failed to load user profile. Please try again.')
        }
      } else {
        setAuthError(result.error || 'Authentication failed')
      }
      return result
    } catch (error) {
      setAuthError('An unexpected error occurred')
      return { success: false, error: 'Unexpected error' }
    } finally {
      setAuthLoading(false)
    }
  }

  const loginWithEmail = async (email, password) => {
    setAuthError(null)
    setNeedsProfileCompletion(false)
    setAuthLoading(true)
    
    try {
      const result = await authService.loginWithEmail(email, password)
      if (result.success && result.user) {
        const userProfile = await getUserProfile(result.user.uid)
        if (userProfile) {
          setCurrentUser({ ...result.user, ...userProfile })
          navigate('/')
        }
      } else {
        setAuthError(result.error || 'Authentication failed')
      }
      return result
    } catch (error) {
      setAuthError('An unexpected error occurred')
      return { success: false, error: 'Unexpected error' }
    } finally {
      setAuthLoading(false)
    }
  }

  const signupWithEmail = async (email, password, userData) => {
    setAuthError(null)
    setNeedsProfileCompletion(false)
    setAuthLoading(true)
    
    try {
      const result = await authService.signupWithEmail(email, password, userData)
      if (result.success && result.user) {
        const userProfile = await getUserProfile(result.user.uid)
        if (userProfile) {
          setCurrentUser({ ...result.user, ...userProfile })
          navigate('/')
        }
      } else {
        setAuthError(result.error || 'Registration failed')
      }
      return result
    } catch (error) {
      setAuthError('An unexpected error occurred')
      return { success: false, error: 'Unexpected error' }
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = async () => {
    setAuthError(null)
    setNeedsProfileCompletion(false)
    const result = await authService.logout()
    if (result.success) {
      setCurrentUser(null)
      navigate('/auth')
    } else {
      setAuthError(result.error)
    }
    return result
  }

  const clearError = () => {
    setAuthError(null)
  }

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          console.log('🔄 Auth state changed: User authenticated')
          const userProfile = await getUserProfile(user.uid)
          if (userProfile) {
            setCurrentUser({ ...user, ...userProfile })
          } else {
            console.warn('⚠️ User authenticated but not found in Firestore')
            // Don't auto-signout, let the user complete profile
            setCurrentUser(user)
            setNeedsProfileCompletion(true)
            navigate('/complete-profile')
          }
        } else {
          console.log('🔒 Auth state changed: No user')
          setCurrentUser(null)
          setNeedsProfileCompletion(false)
        }
      } catch (error) {
        console.error('❌ Auth state change error:', error)
        setAuthError('Authentication error occurred')
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [navigate])

  const value = {
    currentUser,
    authError,
    loading,
    authLoading,
    needsProfileCompletion,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    updateUserProfile,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}