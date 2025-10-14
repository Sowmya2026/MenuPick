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
import { showError, showSuccess, showWarning, showInfo } from '../utils/alertUtils'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false)
  const [firestoreReady, setFirestoreReady] = useState(false)
  const db = getFirestore()
  const navigate = useNavigate()

  // Check Firestore connectivity
  const checkFirestoreConnection = async () => {
    try {
      const testDoc = await getDoc(doc(db, 'test', 'test'))
      setFirestoreReady(true)
      return true
    } catch (error) {
      console.warn('⚠️ Firestore connection issue:', error.message)
      setFirestoreReady(false)
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
      if (error.code === 'permission-denied') {
        return false
      }
      return false
    }
  }

  // Get user profile from Firestore
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
        
        // Check if profile needs completion
        if (data.needsProfileCompletion || !data.profileCompleted) {
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
      return null
    }
  }

  const updateUserProfile = async (updates) => {
    if (!currentUser) return { success: false, error: 'No user logged in' }
    
    try {
      const result = await authService.completeGoogleProfile(currentUser.uid, updates)
      if (result.success) {
        setCurrentUser(prev => ({ 
          ...prev, 
          ...updates, 
          isRegistered: true, 
          needsProfileCompletion: false,
          profileCompleted: true 
        }))
        setNeedsProfileCompletion(false)
        
        // Update Firestore with completed profile
        await setDoc(doc(db, 'users', currentUser.uid), {
          ...updates,
          isRegistered: true,
          needsProfileCompletion: false,
          profileCompleted: true,
          profileCompletedAt: serverTimestamp()
        }, { merge: true })

        showSuccess('Profile Completed', 'Your profile has been completed successfully!')
      }
      return result
    } catch (error) {
      console.error('❌ Error updating user profile:', error)
      showError('Profile Update Failed', 'Failed to update your profile. Please try again.')
      return { success: false, error: error.message }
    }
  }

  const loginWithGoogle = async () => {
    setAuthLoading(true)
    
    try {
      const result = await authService.loginWithGoogle()
      
      if (result.success && result.user) {
        console.log('✅ Google login successful, loading user profile...')
        
        const userProfile = await getUserProfile(result.user.uid)
        
        if (userProfile) {
          setCurrentUser({ ...result.user, ...userProfile })
          
          // Check if profile needs completion
          if (userProfile.needsProfileCompletion || !userProfile.profileCompleted) {
            setNeedsProfileCompletion(true)
            navigate('/complete-profile')
          } else {
            setNeedsProfileCompletion(false)
            showSuccess('Welcome Back!', 'You have successfully signed in.')
            navigate('/')
          }
        } else {
          setCurrentUser({ ...result.user, isRegistered: true })
          showSuccess('Welcome Back!', 'You have successfully signed in.')
          navigate('/')
        }
      } else {
        if (result.error === 'user-not-found') {
          showError('Account Not Found', 'No account found with this Google email. Please sign up first.')
        } else {
          showError('Sign In Failed', result.error || 'Google authentication failed')
        }
      }
      return result
    } catch (error) {
      console.error('❌ Google login error:', error)
      showError('Sign In Failed', 'An unexpected error occurred. Please try again.')
      return { success: false, error: 'Unexpected error' }
    } finally {
      setAuthLoading(false)
    }
  }

  const signupWithGoogle = async () => {
    setAuthLoading(true)
    
    try {
      const result = await authService.signupWithGoogle()
      
      if (result.success && result.user) {
        console.log('✅ Google signup successful, redirecting to complete profile...')
        
        const userProfile = await getUserProfile(result.user.uid)
        if (userProfile) {
          setCurrentUser({ ...result.user, ...userProfile })
        } else {
          setCurrentUser({ ...result.user, isRegistered: false })
        }
        
        setNeedsProfileCompletion(true)
        showSuccess('Account Created', 'Your account has been created successfully! Please complete your profile.')
        navigate('/complete-profile')
        
      } else {
        if (result.error === 'email-already-exists') {
          showError('User Already Registered', 'This email is already registered. Please use the Sign-In method for this account.')
        } else {
          showError('Sign Up Failed', result.error || 'Google authentication failed')
        }
      }
      return result
    } catch (error) {
      console.error('❌ Google signup error:', error)
      showError('Sign Up Failed', 'An unexpected error occurred. Please try again.')
      return { success: false, error: 'Unexpected error' }
    } finally {
      setAuthLoading(false)
    }
  }

  const loginWithEmail = async (email, password) => {
    setAuthLoading(true)
    
    try {
      const result = await authService.loginWithEmail(email, password)
      
      if (result.success && result.user) {
        const userProfile = await getUserProfile(result.user.uid)
        if (userProfile) {
          setCurrentUser({ ...result.user, ...userProfile })
          
          // Check if profile needs completion
          if (userProfile.needsProfileCompletion || !userProfile.profileCompleted) {
            setNeedsProfileCompletion(true)
            navigate('/complete-profile')
          } else {
            setNeedsProfileCompletion(false)
            showSuccess('Welcome Back!', 'You have successfully signed in.')
            navigate('/')
          }
        } else {
          setCurrentUser({ ...result.user, isRegistered: true })
          showSuccess('Welcome Back!', 'You have successfully signed in.')
          navigate('/')
        }
      } else {
        if (result.error === 'user-not-found') {
          showError('Account Not Found', 'Please sign up before signing in.')
        } else {
          showError('Sign In Failed', result.error || 'Authentication failed')
        }
      }
      return result
    } catch (error) {
      console.error('❌ Email login error:', error)
      showError('Sign In Failed', 'An unexpected error occurred. Please try again.')
      return { success: false, error: 'Unexpected error' }
    } finally {
      setAuthLoading(false)
    }
  }

  const signupWithEmail = async (email, password, userData) => {
    setAuthLoading(true)
    
    try {
      // Check for duplicate student ID
      const studentIdExists = await checkStudentIdExists(userData.studentId)
      if (studentIdExists) {
        showError('Registration Number Taken', 'This registration number is already linked to another account.')
        return { success: false, error: 'studentid-already-exists' }
      }

      const result = await authService.signupWithEmail(email, password, userData)
      
      if (result.success && result.user) {
        const userProfile = await getUserProfile(result.user.uid)
        if (userProfile) {
          setCurrentUser({ ...result.user, ...userProfile })
        }
        
        showSuccess('Account Created', 'Your account has been created successfully!')
        navigate('/')
      } else {
        if (result.error === 'email-already-exists') {
          showError('Email Already Registered', 'This email is already registered. Please use the Sign-In option.')
        } else {
          showError('Registration Failed', result.error || 'Registration failed')
        }
      }
      return result
    } catch (error) {
      console.error('❌ Email signup error:', error)
      showError('Registration Failed', 'An unexpected error occurred. Please try again.')
      return { success: false, error: 'Unexpected error' }
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = async () => {
    setNeedsProfileCompletion(false)
    const result = await authService.logout()
    if (result.success) {
      setCurrentUser(null)
      showInfo('Signed Out', 'You have been successfully signed out.')
      navigate('/signin')
    } else {
      showError('Logout Failed', result.error || 'Failed to sign out')
    }
    return result
  }

  useEffect(() => {
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
            if (userProfile.needsProfileCompletion || !userProfile.profileCompleted) {
              setNeedsProfileCompletion(true)
            } else {
              setNeedsProfileCompletion(false)
            }
          } else {
            console.warn('⚠️ User authenticated but not found in Firestore')
            if (user.providerData?.some(provider => provider.providerId === 'google.com')) {
              setCurrentUser(user)
              setNeedsProfileCompletion(true)
            } else {
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
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [navigate])

  const value = {
    currentUser,
    loading,
    authLoading,
    needsProfileCompletion,
    firestoreReady,
    loginWithGoogle,
    signupWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    updateUserProfile,
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