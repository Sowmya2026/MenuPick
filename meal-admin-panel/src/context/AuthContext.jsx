import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '../firebase'
import toast from 'react-hot-toast'

// Create context first
const AuthContext = createContext()

// Then define the provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = async (email, password) => {
    try {
      // Special handling for Demo User: Try to Sign In, if missing, Sign Up
      if (email === 'demo@admin.com') {
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          return result.user;
        } catch (error) {
          // If user doesn't exist, create it (Auto-provisioning for demo)
          if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            try {
              const createResult = await createUserWithEmailAndPassword(auth, email, password);
              toast.success("Demo account created successfully!");
              return createResult.user;
            } catch (createErr) {
              // If creation/other error, throw original
              if (createErr.code === 'auth/email-already-in-use') {
                // Fallback: try login again? Or simpler: Just throw original
                // This handles case where invalid-credential was due to wrong password for existing user
                throw error;
              }
              throw createErr;
            }
          }
          throw error;
        }
      }

      // Normal Login
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      throw error
    }
  }

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const logout = () => {
    return signOut(auth)
  }

  // Auto-logout functionality
  useEffect(() => {
    if (!currentUser) return;

    // 15 minutes in milliseconds
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        toast.error("Session expired due to inactivity");
      }, INACTIVITY_TIMEOUT);
    };

    // Events to track activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    // Attach listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [currentUser]);

  useEffect(() => {
    // Use Firebase auth listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword
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