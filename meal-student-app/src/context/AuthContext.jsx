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
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { showError, showSuccess, showWarning, showInfo } from '../utils/alertUtils'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const db = getFirestore()
  const navigate = useNavigate()

  // Session persistence key
  const SESSION_KEY = 'menupick_user_session'

  // Save session to localStorage
  const saveSessionToStorage = (userData) => {
    try {
      if (userData) {
        const sessionData = {
          user: userData,
          timestamp: Date.now()
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
      } else {
        localStorage.removeItem(SESSION_KEY)
      }
    } catch (error) {
      console.error('❌ Error saving session to storage:', error)
    }
  }

  // Load session from localStorage
  const loadSessionFromStorage = () => {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY)
      if (sessionData) {
        const parsed = JSON.parse(sessionData)
        // Check if session is not too old (7 days)
        const isExpired = Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000
        if (!isExpired) {
          return parsed
        } else {
          localStorage.removeItem(SESSION_KEY)
        }
      }
    } catch (error) {
      console.error('❌ Error loading session from storage:', error)
      localStorage.removeItem(SESSION_KEY)
    }
    return null
  }

  // Check if student ID already exists
  const checkStudentIdExists = async (studentId) => {
    try {
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

  // Get user profile from Firestore - SIMPLIFIED
  const getUserProfile = async (uid) => {
    try {
      console.log('📖 Getting user profile from Firestore...')
      const userDoc = await getDoc(doc(db, 'users', uid))

      if (userDoc.exists()) {
        const data = userDoc.data()
        console.log('✅ User profile found:', data)
        return data
      }
      console.log('❌ User profile not found in Firestore')
      return null
    } catch (error) {
      console.error('❌ Error getting user profile:', error)
      return null
    }
  }

  // SIMPLIFIED user state management
  const setUserState = async (user, userProfile = null) => {
    try {
      if (user) {
        let profileData = userProfile
        if (!profileData) {
          profileData = await getUserProfile(user.uid)
        }

        // Create complete user data
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || profileData?.displayName || '',
          photoURL: user.photoURL || profileData?.photoURL || '',
          metadata: user.metadata || {},
          // Merge with profile data
          ...profileData,
          // Ensure these fields are set
          isRegistered: profileData?.isRegistered || false,
          profileCompleted: profileData?.profileCompleted || false,
          studentId: profileData?.studentId || '',
          messPreference: profileData?.messPreference || 'veg',
        }

        console.log('👤 Setting user state:', {
          uid: userData.uid,
          email: userData.email,
          isRegistered: userData.isRegistered,
          profileCompleted: userData.profileCompleted,
          studentId: userData.studentId,
          displayName: userData.displayName
        })

        setCurrentUser(userData)

        // Save to session storage
        saveSessionToStorage(userData)

        // Track Activity: Update lastActive timestamp in background
        if (userData.uid) {
          setDoc(doc(db, 'users', userData.uid), {
            lastActive: serverTimestamp()
          }, { merge: true }).catch(err => console.error("Error updating lastActive:", err));
        }

        return userData
      } else {
        // User is null (logged out)
        setCurrentUser(null)
        saveSessionToStorage(null)
        return null
      }
    } catch (error) {
      console.error('❌ Error setting user state:', error)
      return null
    }
  }

  const updateUserProfile = async (updates) => {
    if (!currentUser) return { success: false, error: 'No user logged in' }

    try {
      // Create complete update object with all possible fields
      const profileUpdates = {
        updatedAt: serverTimestamp()
      };

      // Add fields if they exist in updates
      if (updates.displayName !== undefined) profileUpdates.displayName = updates.displayName;
      if (updates.name !== undefined) {
        profileUpdates.name = updates.name;
        profileUpdates.displayName = updates.name; // Sync displayName with name
      }
      if (updates.studentId !== undefined) profileUpdates.studentId = updates.studentId;
      if (updates.messPreference !== undefined) profileUpdates.messPreference = updates.messPreference;
      if (updates.phone !== undefined) profileUpdates.phone = updates.phone;
      if (updates.hostel !== undefined) profileUpdates.hostel = updates.hostel;
      if (updates.room !== undefined) profileUpdates.room = updates.room;

      // If this is initial profile completion
      if (updates.studentId && updates.messPreference) {
        profileUpdates.isRegistered = true;
        profileUpdates.profileCompleted = true;
        profileUpdates.profileCompletedAt = serverTimestamp();
      }

      console.log('💾 Updating Firestore with:', profileUpdates);

      // Update Firestore first
      await setDoc(doc(db, 'users', currentUser.uid), profileUpdates, { merge: true });

      // Then update local state
      const updatedUser = {
        ...currentUser,
        ...updates,
      };

      await setUserState(updatedUser, updatedUser);

      showSuccess('Profile Updated', 'Your profile has been updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      showError('Profile Update Failed', 'Failed to update your profile. Please try again.');
      return { success: false, error: error.message };
    }
  }

  const loginWithGoogle = async () => {
    setAuthLoading(true)

    try {
      const result = await authService.loginWithGoogle()

      if (result.success && result.user) {
        console.log('✅ Google login successful, loading user profile...')

        const userState = await setUserState(result.user)

        if (userState) {
          // Check if profile needs completion
          if (!userState.profileCompleted) {
            showInfo('Complete Your Profile', 'Please complete your profile to continue.')
            navigate('/complete-profile')
          } else {
            showSuccess('Welcome Back!', 'You have successfully signed in.')
            navigate('/')
          }
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

        const userState = await setUserState(result.user)

        if (userState) {
          showSuccess('Account Created', 'Your account has been created successfully! Please complete your profile.')
          navigate('/complete-profile')
        }
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
        const userState = await setUserState(result.user)

        if (userState) {
          // Check if profile needs completion
          if (!userState.profileCompleted) {
            showInfo('Complete Your Profile', 'Please complete your profile to continue.')
            navigate('/complete-profile')
          } else {
            showSuccess('Welcome Back!', 'You have successfully signed in.')
            navigate('/')
          }
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
        // Create complete user profile immediately for email signup
        const completeUserData = {
          ...userData,
          isRegistered: true,
          profileCompleted: true
        }

        const userState = await setUserState(result.user, completeUserData)

        if (userState) {
          showSuccess('Account Created', 'Your account has been created successfully!')
          navigate('/')
        }
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
    const result = await authService.logout()
    if (result.success) {
      await setUserState(null)
      showInfo('Signed Out', 'You have been successfully signed out.')
      navigate('/signin')
    } else {
      showError('Logout Failed', result.error || 'Failed to sign out')
    }
    return result
  }

  // Initialize auth state with real-time Firestore sync
  const initializeAuthState = () => {
    let firestoreUnsubscribe = null;

    try {
      setLoading(true)

      // First, try to load from session storage for immediate UI
      const savedSession = loadSessionFromStorage()
      if (savedSession) {
        console.log('🔄 Found saved session, restoring user state...')
        setCurrentUser(savedSession.user)
      }

      // Then set up Firebase auth listener
      const authUnsubscribe = authService.onAuthStateChanged(async (user) => {
        // Unsubscribe from previous user doc if exists
        if (firestoreUnsubscribe) {
          firestoreUnsubscribe();
          firestoreUnsubscribe = null;
        }

        try {
          if (user) {
            console.log('🔄 Firebase auth state changed: User authenticated')

            // Setup real-time listener for user profile
            const userRef = doc(db, 'users', user.uid);
            firestoreUnsubscribe = onSnapshot(userRef, (docSnap) => {
              if (docSnap.exists()) {
                const profileData = docSnap.data();

                // Merge auth user + profile data
                const userData = {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName || profileData?.displayName || '',
                  photoURL: user.photoURL || profileData?.photoURL || '',
                  metadata: user.metadata || {},
                  ...profileData,
                  isRegistered: profileData?.isRegistered || false,
                  profileCompleted: profileData?.profileCompleted || false,
                  studentId: profileData?.studentId || '',
                  messPreference: profileData?.messPreference || 'veg',
                };

                console.log('🔄 Real-time user update received');
                setCurrentUser(userData);
                saveSessionToStorage(userData);
              }
            }, (error) => {
              console.error("Error in user snapshot listener:", error);
            });

            // We also do one-time fetch/set via setUserState to ensure we handle the promise if needed,
            // but the listener above is the primary sync mechanism.
            // Actually, to avoid race conditions, we stick to the listener as the source of truth for updates.
          } else {
            console.log('🔒 Firebase auth state changed: No user')
            setCurrentUser(null)
            saveSessionToStorage(null)
          }
        } catch (error) {
          console.error('❌ Auth state change error:', error)
          setCurrentUser(null)
        } finally {
          setLoading(false)
        }
      })

      // Return a function that unsubscribes BOTH
      return () => {
        authUnsubscribe();
        if (firestoreUnsubscribe) firestoreUnsubscribe();
      }
    } catch (error) {
      console.error('❌ Error initializing auth state:', error)
      setLoading(false)
      return () => { }
    }
  }

  useEffect(() => {
    const unsubscribeFn = initializeAuthState()

    return () => {
      // The result of initializeAuthState is now a synchronous cleanup function (or promise of one? No, I made it sync in replacement)
      // Wait, original was async but I removed async keyword from initializeAuthState definition in replacement
      // But authService.onAuthStateChanged is sync (returns unsub), so initializeAuthState can be sync.
      if (unsubscribeFn) unsubscribeFn();
    }
  }, [])

  const value = {
    currentUser,
    loading,
    authLoading,
    firestoreReady: true, // Simplified - assume Firestore is ready
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