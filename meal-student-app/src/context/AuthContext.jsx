import { createContext, useState, useEffect, useContext } from 'react'
import { authService } from '../services/authService'
import { 
  getFirestore, 
  doc, 
  getDoc,
  query,
  where,
  setDoc,
  collection,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [firestoreReady, setFirestoreReady] = useState(false)
  const db = getFirestore()
  const navigate = useNavigate()

  // Check Firestore connectivity
  const checkFirestoreConnection = async () => {
    try {
      // Try to read a document to test permissions
      const testDoc = await getDoc(doc(db, 'test', 'test'))
      setFirestoreReady(true)
      return true
    } catch (error) {
      console.warn('⚠️ Firestore connection issue:', error.message)
      setFirestoreReady(false)
      return false
    }
  }

  // Check if email already exists
  const checkEmailExists = async (email) => {
    try {
      if (!firestoreReady) {
        console.warn('Firestore not ready, skipping email check')
        return false
      }
      
      console.log('📧 Checking email existence:', email)
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('email', '==', email.toLowerCase().trim()))
      const querySnapshot = await getDocs(q)
      
      const exists = !querySnapshot.empty
      console.log('📧 Email exists:', exists)
      return exists
    } catch (error) {
      console.error('❌ Error checking email:', error)
      // If it's a permissions error, assume email doesn't exist to allow signup
      if (error.code === 'permission-denied') {
        return false
      }
      return false
    }
  }

  // Check if student ID already exists
  const checkStudentIdExists = async (studentId) => {
    try {
      if (!firestoreReady) {
        console.warn('Firestore not ready, skipping student ID check')
        return false
      }
      
      console.log('🎓 Checking student ID existence:', studentId)
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('studentId', '==', studentId.trim().toUpperCase()))
      const querySnapshot = await getDocs(q)
      
      const exists = !querySnapshot.empty
      console.log('🎓 Student ID exists:', exists)
      return exists
    } catch (error) {
      console.error('❌ Error checking student ID:', error)
      // If it's a permissions error, assume student ID doesn't exist to allow signup
      if (error.code === 'permission-denied') {
        return false
      }
      return false
    }
  }

  // Get user profile from Firestore with error handling
  const getUserProfile = async (uid) => {
    try {
      if (!firestoreReady) {
        console.warn('Firestore not ready, skipping profile fetch')
        return null
      }
      
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
      
      // Handle specific Firestore errors
      if (error.code === 'permission-denied') {
        console.warn('⚠️ Firestore permissions denied for user profile')
        setAuthError('Database permissions issue. Please contact support.')
      } else {
        setAuthError('Failed to load user profile')
      }
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
        
        // Update Firestore with completed profile
        await setDoc(doc(db, 'users', currentUser.uid), {
          ...updates,
          isRegistered: true,
          needsProfileCompletion: false,
          profileCompletedAt: serverTimestamp()
        }, { merge: true })
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
          
          if (result.needsProfileCompletion || userProfile.needsProfileCompletion) {
            setNeedsProfileCompletion(true)
            console.log('🔄 Redirecting to complete profile...')
            navigate('/complete-profile')
          } else {
            console.log('✅ Profile complete, redirecting to home...')
            navigate('/')
          }
        } else {
          // If we can't get profile due to permissions, still allow login but mark for completion
          console.warn('⚠️ Could not load user profile, marking for completion')
          setCurrentUser({ ...result.user, isRegistered: false })
          setNeedsProfileCompletion(true)
          navigate('/complete-profile')
        }
      } else {
        setAuthError(result.error || 'Authentication failed')
      }
      return result
    } catch (error) {
      console.error('❌ Google login error:', error)
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
          
          // Check if profile needs completion
          if (userProfile.needsProfileCompletion) {
            setNeedsProfileCompletion(true)
            navigate('/complete-profile')
          } else {
            navigate('/')
          }
        } else {
          // If we can't get profile but auth succeeded, still allow login
          console.warn('⚠️ Could not load user profile, but allowing login')
          setCurrentUser({ ...result.user, isRegistered: true })
          navigate('/')
        }
      } else {
        // Handle specific error cases
        if (result.code === 'user-not-registered') {
          setAuthError("You don't have an account. Please sign up first.")
        } else {
          setAuthError(result.error || 'Authentication failed')
        }
      }
      return result
    } catch (error) {
      console.error('❌ Email login error:', error)
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
      // Only check for duplicates if Firestore is ready
      if (firestoreReady) {
        // Check for duplicate email
        const emailExists = await checkEmailExists(email)
        if (emailExists) {
          setAuthError('This email is already registered. Please sign in instead.')
          return { success: false, error: 'email-already-exists' }
        }

        // Check for duplicate student ID
        const studentIdExists = await checkStudentIdExists(userData.studentId)
        if (studentIdExists) {
          setAuthError('This registration number is already linked to another account.')
          return { success: false, error: 'studentid-already-exists' }
        }
      } else {
        console.warn('⚠️ Firestore not ready, skipping duplicate checks')
      }

      const result = await authService.signupWithEmail(email, password, userData)
      if (result.success && result.user) {
        const userProfile = await getUserProfile(result.user.uid)
        if (userProfile) {
          setCurrentUser({ ...result.user, ...userProfile })
          
          // REDIRECT TO SIGNIN AFTER SUCCESSFUL SIGNUP
          console.log('✅ Email signup successful, redirecting to signin...')
          navigate('/signin', { 
            state: { 
              message: 'Account created successfully. Please sign in to continue.',
              messageType: 'success'
            }
          })
        } else {
          // If profile creation failed but auth succeeded, still show success
          setCurrentUser({ ...result.user, isRegistered: true })
          navigate('/signin', { 
            state: { 
              message: 'Account created successfully. Please sign in to continue.',
              messageType: 'success'
            }
          })
        }
      } else {
        setAuthError(result.error || 'Registration failed')
      }
      return result
    } catch (error) {
      console.error('❌ Email signup error:', error)
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
      navigate('/signin')
    } else {
      setAuthError(result.error)
    }
    return result
  }

  const clearError = () => {
    setAuthError(null)
  }

  // Reset password function
  const resetPassword = async (email) => {
    setAuthError(null)
    setAuthLoading(true)
    
    try {
      // This would integrate with Firebase Auth password reset
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true, message: 'Password reset email sent successfully.' }
    } catch (error) {
      console.error('❌ Password reset error:', error)
      return { success: false, error: 'Failed to send password reset email.' }
    } finally {
      setAuthLoading(false)
    }
  }

  useEffect(() => {
    // Check Firestore connection on component mount
    checkFirestoreConnection()
  }, [])

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          console.log('🔄 Auth state changed: User authenticated')
          const userProfile = await getUserProfile(user.uid)
          if (userProfile) {
            setCurrentUser({ ...user, ...userProfile })
            
            // Check if user needs profile completion
            if (userProfile.needsProfileCompletion) {
              setNeedsProfileCompletion(true)
              // Don't auto-redirect here to avoid interrupting user flow
            } else {
              setNeedsProfileCompletion(false)
            }
          } else {
            console.warn('⚠️ User authenticated but not found in Firestore')
            // For Google users, they might need profile completion
            if (user.providerData?.some(provider => provider.providerId === 'google.com')) {
              setCurrentUser(user)
              setNeedsProfileCompletion(true)
            } else {
              // For email users, this might be an error
              setCurrentUser(user)
            }
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
    firestoreReady,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    updateUserProfile,
    resetPassword,
    clearError,
    checkEmailExists,
    checkStudentIdExists
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