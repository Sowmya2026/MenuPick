import { 
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from './firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebaseConfig'

const googleProvider = new GoogleAuthProvider()

// Helper function to extract error message
const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
}

export const authService = {
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Create or update user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
        dietaryPreferences: [],
        allergies: []
      }, { merge: true })
      
      return { success: true, user }
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error),
        code: error.code
      }
    }
  },

  async logout() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error),
        code: error.code
      }
    }
  },

  getCurrentUser() {
    return auth.currentUser
  },

  isLoggedIn() {
    return !!auth.currentUser
  },

  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback)
  }
}

export default authService