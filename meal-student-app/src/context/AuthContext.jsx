import { createContext, useState, useEffect, useContext } from 'react'
import { authService } from '../services/authService'
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc 
} from 'firebase/firestore'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const db = getFirestore()

  // Get user profile from Firestore
  const getUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        return userDoc.data()
      }
      return null
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  // Create or update user profile
  const updateUserProfile = async (updates) => {
    if (!currentUser) return { success: false, error: 'No user logged in' }
    
    try {
      const userRef = doc(db, 'users', currentUser.uid)
      await setDoc(userRef, updates, { merge: true })
      
      // Update local state
      setCurrentUser(prev => ({ ...prev, ...updates }))
      return { success: true }
    } catch (error) {
      console.error('Error updating user profile:', error)
      return { success: false, error: error.message }
    }
  }

  const loginWithGoogle = async () => {
    const result = await authService.loginWithGoogle()
    if (result.success && result.user) {
      // Get user profile from Firestore
      const userProfile = await getUserProfile(result.user.uid)
      setCurrentUser({ ...result.user, ...userProfile })
    }
    return result
  }

  const logout = async () => {
    const result = await authService.logout()
    if (result.success) {
      setCurrentUser(null)
    }
    return result
  }

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        // Get user profile from Firestore
        const userProfile = await getUserProfile(user.uid)
        setCurrentUser({ ...user, ...userProfile })
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    loginWithGoogle,
    logout,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Create and export the useAuth hook here
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}