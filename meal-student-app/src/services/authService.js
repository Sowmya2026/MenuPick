import { 
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from './firebaseConfig'
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore'
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

// Check if email exists in Firestore (NEW - for pre-check)
const checkEmailExistsInFirestore = async (email) => {
  try {
    console.log('🔍 Checking if email exists:', email)
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email.toLowerCase().trim()))
    const querySnapshot = await getDocs(q)
    
    const exists = !querySnapshot.empty
    console.log('📧 Email exists in Firestore:', exists)
    return exists
  } catch (error) {
    console.error('❌ Error checking email existence:', error)
    return false
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
      needsProfileCompletion: true,
      profileCompleted: false
    }
    
    await setDoc(doc(db, 'users', user.uid), userData)
    console.log('✅ User created successfully in Firestore')
    return true
  } catch (error) {
    console.error('❌ Error creating user in Firestore:', error)
    return false
  }
}

// NEW: Pre-check for Google authentication
const preCheckGoogleAuth = async (userEmail) => {
  try {
    console.log('🔍 Pre-checking Google user:', userEmail)
    const emailExists = await checkEmailExistsInFirestore(userEmail)
    return emailExists
  } catch (error) {
    console.error('❌ Pre-check error:', error)
    return false
  }
}

export const authService = {
  // NEW: Separate method for Google Sign-In (existing users)
  async loginWithGoogle() {
    try {
      console.log('🔐 Starting Google sign-in for existing users...')
      
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      console.log('✅ Google authentication successful, checking Firestore...')
      
      // Check if user exists in Firestore
      const userExists = await checkUserExistsInFirestore(user.uid)
      
      if (!userExists) {
        console.log('❌ User not found in Firestore, signing out...')
        await signOut(auth)
        return { 
          success: false, 
          error: 'No account found with this Google email. Please sign up first.',
          code: 'user-not-found'
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
        isNewUser: false
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

  // NEW: Separate method for Google Sign-Up (new users)
  async signupWithGoogle() {
    try {
      console.log('🔐 Starting Google sign-up for new users...')
      
      // First, check if we can get user info without full auth
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      console.log('✅ Google authentication successful, checking if user exists...')
      
      // Check if user already exists in Firestore
      const userExists = await checkUserExistsInFirestore(user.uid)
      
      if (userExists) {
        console.log('❌ User already exists, signing out...')
        await signOut(auth)
        return { 
          success: false, 
          error: 'This email is already registered. Please sign in instead.',
          code: 'email-already-exists'
        }
      }
      
      // Create new user in Firestore
      console.log('👤 Creating new Google user account...')
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
        isNewUser: true
      }
      
    } catch (error) {
      console.error('❌ Google sign-up error:', error)
      // Sign out if there was an error during sign-up
      await signOut(auth)
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
      
      // NEW: Check if email exists before attempting login
      const emailExists = await checkEmailExistsInFirestore(email)
      if (!emailExists) {
        return { 
          success: false, 
          error: 'No account found. Please sign up first.',
          code: 'user-not-found'
        }
      }

      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = result.user
      
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
      
      // NEW: Check if email already exists
      const emailExists = await checkEmailExistsInFirestore(email)
      if (emailExists) {
        return { 
          success: false, 
          error: 'This email is already registered. Please sign in instead.',
          code: 'email-already-exists'
        }
      }

      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user
      
      console.log('✅ Firebase Auth user created:', user.uid)
      
      // Create user in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email.toLowerCase().trim(),
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
        needsProfileCompletion: false,
        profileCompleted: true
      })
      
      console.log('✅ Firestore user profile created')
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
        profileCompleted: true,
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