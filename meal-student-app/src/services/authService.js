import { 
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from './firebaseConfig'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebaseConfig'

// Configure Google Auth Provider properly
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Helper function to extract error message
const getErrorMessage = (error) => {
  if (!error || !error.code) {
    return 'An unexpected error occurred. Please try again.';
  }
  
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
      return 'You don\'t have an account yet. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/cancelled-popup-request':
    case 'auth/popup-closed':
      return 'Sign-in was cancelled.';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed. Please contact support.';
    case 'auth/internal-error':
      return 'Internal error occurred. Please try again.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
}

// Check if user exists in Firestore with retry logic
const checkUserExistsInFirestore = async (uid, retries = 3) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    console.log('User exists in Firestore:', userDoc.exists())
    return userDoc.exists()
  } catch (error) {
    console.error('Error checking user existence:', error)
    if (retries > 0) {
      console.log(`Retrying user check... (${retries} retries left)`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return checkUserExistsInFirestore(uid, retries - 1)
    }
    return false
  }
}

// Create user in Firestore for Google sign-in
const createGoogleUserInFirestore = async (user) => {
  try {
    console.log('Creating user in Firestore:', user.uid)
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      studentId: '',
      messPreference: 'veg',
      photoURL: user.photoURL || '',
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp(),
      dietaryPreferences: [],
      allergies: [],
      accountType: 'google',
      isRegistered: false,
      needsProfileCompletion: true
    }
    
    await setDoc(doc(db, 'users', user.uid), userData)
    console.log('✅ User created successfully in Firestore')
    return true
  } catch (error) {
    console.error('❌ Error creating user in Firestore:', error)
    return false
  }
}

export const authService = {
  async loginWithGoogle() {
    try {
      console.log('🔐 Starting Google sign-in...')
      
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      console.log('✅ Google authentication successful, checking Firestore...')
      
      // Wait a moment for Firestore to be ready
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if user exists in Firestore
      const userExists = await checkUserExistsInFirestore(user.uid)
      
      if (!userExists) {
        console.log('👤 User not found in Firestore, creating new account...')
        
        // Create user in Firestore
        const created = await createGoogleUserInFirestore(user)
        
        if (!created) {
          console.log('❌ Failed to create user in Firestore, signing out...')
          await signOut(auth)
          return { 
            success: false, 
            error: 'Failed to create your account. Please try again.',
            code: 'firestore-create-failed'
          }
        }
        
        console.log('🎉 New Google user account created successfully!')
        return { 
          success: true, 
          user,
          needsProfileCompletion: true,
          isNewUser: true,
          message: 'Account created successfully! Please complete your profile.'
        }
      }
      
      // User exists, update last login
      console.log('✅ Existing user found, updating last login...')
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true })
      
      console.log('✅ Google sign-in completed successfully')
      return { 
        success: true, 
        user,
        isNewUser: false,
        message: 'Signed in successfully!'
      }
      
    } catch (error) {
      console.error('❌ Google sign-in error:', error)
      return { 
        success: false, 
        error: getErrorMessage(error),
        code: error.code
      }
    }
  },

  async loginWithEmail(email, password) {
    try {
      console.log('🔐 Starting email sign-in...')
      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = result.user
      
      // Check if user exists in Firestore
      const userExists = await checkUserExistsInFirestore(user.uid)
      
      if (!userExists) {
        await signOut(auth)
        return { 
          success: false, 
          error: 'You don\'t have an account yet. Please sign up first.',
          code: 'user-not-registered'
        }
      }
      
      // Update last login
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true })
      
      return { success: true, user }
    } catch (error) {
      console.error('❌ Email sign-in error:', error)
      return { 
        success: false, 
        error: getErrorMessage(error),
        code: error.code
      }
    }
  },

  async signupWithEmail(email, password, userData) {
    try {
      console.log('📝 Starting email signup...')
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user
      
      // Create user in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName,
        studentId: userData.studentId,
        messPreference: userData.messPreference,
        photoURL: '',
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
        dietaryPreferences: [],
        allergies: [],
        accountType: 'email',
        isRegistered: true,
        needsProfileCompletion: false
      })
      
      return { success: true, user }
    } catch (error) {
      console.error('❌ Email signup error:', error)
      return { 
        success: false, 
        error: getErrorMessage(error),
        code: error.code
      }
    }
  },

  async completeGoogleProfile(uid, userData) {
    try {
      await setDoc(doc(db, 'users', uid), {
        displayName: userData.displayName,
        studentId: userData.studentId,
        messPreference: userData.messPreference,
        isRegistered: true,
        needsProfileCompletion: false,
        profileCompletedAt: serverTimestamp()
      }, { merge: true })
      
      return { success: true }
    } catch (error) {
      console.error('❌ Error completing profile:', error)
      return { success: false, error: error.message }
    }
  },

  async logout() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      console.error('❌ Logout error:', error)
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