import { 
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
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
        studentId: user.studentId || '',
        messPreference: user.messPreference || 'veg',
        dietaryPreferences: [],
        allergies: [],
        accountType: 'google'
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

  async loginWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = result.user
      
      // Update last login time
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date().toISOString()
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

  async signupWithEmail(email, password, userData) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user
      
      // Create user document in Firestore with additional data
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName,
        studentId: userData.studentId,
        messPreference: userData.messPreference,
        photoURL: '',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        dietaryPreferences: [],
        allergies: [],
        accountType: 'email'
      })
      
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