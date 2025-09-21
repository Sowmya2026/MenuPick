import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '../firebase'

// Create context first
const AuthContext = createContext()

// Demo user data
const DEMO_USER = {
  email: 'demo@admin.com',
  uid: 'demo-user-id-12345',
  displayName: 'Demo Administrator',
  isDemo: true,
  joinDate: 'January 2023',
  role: 'Administrator'
}

// Then define the provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const login = async (email, password) => {
    try {
      // Check for demo credentials first
      if (email === 'demo@admin.com' && password === 'demo123') {
        setIsDemoMode(true)
        const demoUser = { ...DEMO_USER }
        setCurrentUser(demoUser)
        localStorage.setItem('demoUser', JSON.stringify(demoUser))
        localStorage.setItem('isDemoMode', 'true')
        return demoUser
      }
      
      // Otherwise, use Firebase authentication
      setIsDemoMode(false)
      localStorage.removeItem('demoUser')
      localStorage.removeItem('isDemoMode')
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      throw error
    }
  }

  const signup = (email, password) => {
    setIsDemoMode(false)
    localStorage.removeItem('demoUser')
    localStorage.removeItem('isDemoMode')
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const logout = () => {
    if (isDemoMode) {
      setIsDemoMode(false)
      setCurrentUser(null)
      localStorage.removeItem('demoUser')
      localStorage.removeItem('isDemoMode')
      return Promise.resolve()
    }
    localStorage.removeItem('demoUser')
    localStorage.removeItem('isDemoMode')
    return signOut(auth)
  }

  useEffect(() => {
    // Check for demo user in localStorage on component mount
    const demoUser = localStorage.getItem('demoUser')
    const demoMode = localStorage.getItem('isDemoMode')
    
    if (demoUser && demoMode === 'true') {
      setIsDemoMode(true)
      setCurrentUser(JSON.parse(demoUser))
      setLoading(false)
      return
    }

    // Otherwise, use Firebase auth listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    isDemoMode,
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Define the custom hook AFTER the provider
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}