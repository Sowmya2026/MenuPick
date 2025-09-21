import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  Timestamp,
  increment
} from 'firebase/firestore'
import { db } from './firebaseConfig'

// Mess operations
export const getMessOptions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'messOptions'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting mess options:', error)
    throw error
  }
}

// Meal operations
export const getMeals = async (messId) => {
  try {
    const q = query(
      collection(db, 'meals'),
      where('messId', '==', messId),
      where('date', '>=', Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000))),
      orderBy('date', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting meals:', error)
    throw error
  }
}

// Student preferences
export const getStudentPreferences = async (studentId) => {
  try {
    const docRef = doc(db, 'studentPreferences', studentId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data().preferences : []
  } catch (error) {
    console.error('Error getting preferences:', error)
    throw error
  }
}

export const saveStudentPreferences = async (studentId, preferences) => {
  try {
    await setDoc(doc(db, 'studentPreferences', studentId), {
      preferences,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error('Error saving preferences:', error)
    throw error
  }
}

// Feedback operations
export const submitFeedback = async (mealId, rating, comment) => {
  try {
    await setDoc(doc(collection(db, 'feedback')), {
      mealId,
      rating,
      comment,
      createdAt: Timestamp.now()
    })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    throw error
  }
}

export const getMealFeedback = async (mealId) => {
  try {
    const q = query(
      collection(db, 'feedback'),
      where('mealId', '==', mealId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => doc.data())
  } catch (error) {
    console.error('Error getting feedback:', error)
    throw error
  }
}

export const likeMeal = async (mealId) => {
  try {
    const docRef = doc(db, 'mealLikes', mealId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        likes: increment(1)
      })
    } else {
      await setDoc(docRef, {
        likes: 1,
        dislikes: 0
      })
    }
  } catch (error) {
    console.error('Error liking meal:', error)
    throw error
  }
}

export const dislikeMeal = async (mealId) => {
  try {
    const docRef = doc(db, 'mealLikes', mealId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        dislikes: increment(1)
      })
    } else {
      await setDoc(docRef, {
        likes: 0,
        dislikes: 1
      })
    }
  } catch (error) {
    console.error('Error disliking meal:', error)
    throw error
  }
}

// Export as default for backward compatibility
export default {
  getMessOptions,
  getMeals,
  getStudentPreferences,
  saveStudentPreferences,
  submitFeedback,
  getMealFeedback,
  likeMeal,
  dislikeMeal
}