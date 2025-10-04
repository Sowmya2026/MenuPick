import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  getDoc,
  writeBatch
} from 'firebase/firestore'
import { db } from '../services/firebaseConfig'
import toast from 'react-hot-toast'

// Create context
const MealContext = createContext()

// Define maximum items for student selections
const MAX_ITEMS = {
  breakfast: {
    'veg': { 'Tiffin': 14, 'Chutney': 7 },
    'non-veg': { 'Tiffin': 14, 'Chutney': 7, 'Egg': 5 },
    'special': { 'Tiffin': 14, 'Chutney': 7, 'Egg': 5, 'Juices': 7 }
  },
  lunch: {
    'veg': { 'Rice': 7, 'Curry': 14, 'Accompaniments': 7, 'Dessert': 3 },
    'non-veg': {'Rice': 7, 'Curry': 14, 'Accompaniments': 7, 'Dessert': 3, 'Chicken': 3 },
    'special': { 'Rice': 7, 'Curry': 14, 'Accompaniments': 7, 'Dessert': 3, 'Chicken': 3, 'Fish': 2 }
  },
  snacks: {
    'veg': { 'Snacks': 7 },
    'non-veg': { 'Snacks': 7 },
    'special': { 'Snacks': 7 }
  },
  dinner: {
    'veg': { 'Staples': 7, 'Curries': 14, 'Side Dishes': 7, 'Accompaniments': 7 },
    'non-veg': { 'Staples': 7, 'Curries': 14, 'Side Dishes': 7, 'Fish': 2 },
    'special': {'Staples': 7, 'Curries': 14, 'Side Dishes': 7, 'Special Items': 3 }
  }
}

// Meal Provider Component
export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([])
  const [categories] = useState(['breakfast', 'lunch', 'snacks', 'dinner'])
  const [messTypes] = useState(['veg', 'non-veg', 'special'])
  const [loading, setLoading] = useState(false)
  const [studentSelections, setStudentSelections] = useState({})
  const [allStudents, setAllStudents] = useState([])

  // Helper function to get all subcategories for a category and mess type
  const getSubcategories = (category, messType) => {
    const subcategoriesMap = {
      breakfast: {
        'veg': ['Tiffin', 'Chutney'],
        'non-veg': ['Tiffin', 'Chutney', 'Egg'],
        'special': ['Tiffin', 'Chutney', 'Egg', 'Juices']
      },
      lunch: {
        'veg': ['Rice', 'Curry', 'Accompaniments', 'Dessert'],
        'non-veg': ['Rice', 'Curry', 'Accompaniments', 'Dessert', 'Chicken'],
        'special': ['Rice', 'Curry', 'Accompaniments', 'Dessert', 'Chicken', 'Fish']
      },
      snacks: {
        'veg': ['Snacks'],
        'non-veg': ['Snacks'],
        'special': ['Snacks']
      },
      dinner: {
        'veg': ['Staples', 'Curries', 'Side Dishes', 'Accompaniments'],
        'non-veg': ['Staples', 'Curries', 'Side Dishes', 'Fish'],
        'special': ['Staples', 'Curries', 'Side Dishes',  'Special Items']
      }
    }
    
    return subcategoriesMap[category]?.[messType] || ['General']
  }

  // Helper function to check if a subcategory has reached its maximum items for student selections
  const checkSubcategoryLimit = useCallback((category, messType, subcategory, currentSelections = {}) => {
    // Count current selections in this subcategory
    const currentCount = Object.values(currentSelections).filter(selection => 
      selection.category === category && 
      selection.subcategory === subcategory
    ).length
    
    const maxAllowed = MAX_ITEMS[category]?.[messType]?.[subcategory] || 0
    
    return {
      currentCount,
      maxAllowed,
      hasReachedLimit: currentCount >= maxAllowed
    }
  }, [])

  // Fetch all students
  const fetchAllStudents = useCallback(async () => {
    try {
      const studentsRef = collection(db, 'students')
      const querySnapshot = await getDocs(studentsRef)
      
      const studentsData = []
      querySnapshot.forEach((doc) => {
        studentsData.push({ id: doc.id, ...doc.data() })
      })
      
      setAllStudents(studentsData)
      return studentsData
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Error fetching students: ' + error.message)
      return []
    }
  }, [])

  // Fetch all meals
  useEffect(() => {
    setLoading(true)
    
    const fetchAllMeals = async () => {
      try {
        const allMeals = []
        
        // Fetch from all mess types
        for (const messType of messTypes) {
          // Fetch from all categories
          for (const category of categories) {
            const subcategories = getSubcategories(category, messType)
            
            // Fetch from all subcategories
            for (const subcategory of subcategories) {
              try {
                // Create collection reference with proper path
                const mealsRef = collection(db, 'Meals', messType, 'categories', category, 'subcategories', subcategory, 'items')
                const q = query(mealsRef, orderBy('createdAt', 'desc'))
                
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc) => {
                  const data = doc.data()
                  allMeals.push({ 
                    id: doc.id, 
                    ...data,
                    messType,
                    category,
                    subcategory,
                    path: `Meals/${messType}/categories/${category}/subcategories/${subcategory}/items/${doc.id}`,
                    // Ensure proper date format for client-side
                    createdAt: data.createdAt?.toDate?.() || data.createdAt,
                    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
                  })
                })
              } catch (error) {
                console.warn(`No meals found in Meals/${messType}/categories/${category}/subcategories/${subcategory}/items:`, error.message)
                // Continue with other collections
              }
            }
          }
        }
        
        setMeals(allMeals)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching meals:', error)
        setLoading(false)
        toast.error('Error fetching meals: ' + error.message)
      }
    }

    fetchAllMeals()
    fetchAllStudents()
  }, [])

  // Fetch student meal selections
  const fetchStudentSelections = useCallback(async (studentId) => {
    try {
      if (!studentId) return
      
      // Updated path to students/{id}/preferences/mealSelections
      const selectionsRef = doc(db, 'students', studentId, 'preferences', 'mealSelections')
      const docSnap = await getDoc(selectionsRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setStudentSelections(prev => ({
          ...prev,
          [studentId]: data
        }))
        return data
      }
      return null
    } catch (error) {
      console.error('Error fetching student selections:', error)
      return null
    }
  }, [])

  // Clear non-veg selections when veg is selected
  const clearNonVegSelections = useCallback(async (studentId, currentSelections = {}) => {
    try {
      const batch = writeBatch(db)
      let hasNonVeg = false

      // Identify non-veg selections to remove
      Object.entries(currentSelections).forEach(([mealId, selection]) => {
        if (selection.messType === 'non-veg') {
          hasNonVeg = true
          // Remove from Firestore (we'll handle this in the batch)
        }
      })

      if (hasNonVeg) {
        // Create a new selections object without non-veg items
        const updatedSelections = {}
        Object.entries(currentSelections).forEach(([mealId, selection]) => {
          if (selection.messType !== 'non-veg') {
            updatedSelections[mealId] = selection
          }
        })

        // Update Firestore
        const selectionsRef = doc(db, 'students', studentId, 'preferences', 'mealSelections')
        batch.set(selectionsRef, { 
          selections: updatedSelections,
          updatedAt: serverTimestamp()
        }, { merge: true })

        await batch.commit()
        
        // Update local state
        setStudentSelections(prev => ({
          ...prev,
          [studentId]: {
            ...prev[studentId],
            selections: updatedSelections
          }
        }))

        toast.success('Non-veg selections cleared as you selected veg items')
        return updatedSelections
      }

      return currentSelections
    } catch (error) {
      console.error('Error clearing non-veg selections:', error)
      throw error
    }
  }, [])

  // Save student meal selections with automatic non-veg cleanup
  const saveStudentSelections = async (studentId, messType, selections, mealDataMap) => {
    try {
      // Add category and subcategory information to each selection
      const selectionsWithDetails = {}
      Object.entries(selections).forEach(([mealId, selection]) => {
        const meal = mealDataMap[mealId]
        if (meal) {
          selectionsWithDetails[mealId] = {
            ...selection,
            category: meal.category,
            subcategory: meal.subcategory,
            messType: meal.messType
          }
        }
      })

      // Check if user is selecting veg items
      const hasVegSelection = Object.values(selectionsWithDetails).some(
        selection => selection.messType === 'veg'
      )

      let finalSelections = selectionsWithDetails

      // If user is selecting veg items, clear all non-veg selections
      if (hasVegSelection) {
        // Get current selections to check for existing non-veg items
        const currentSelections = studentSelections[studentId]?.selections || {}
        
        // Clear non-veg selections and get updated selections
        finalSelections = await clearNonVegSelections(studentId, {
          ...currentSelections,
          ...selectionsWithDetails
        })
      }

      const selectionsData = {
        messType: hasVegSelection ? 'veg' : messType, // Update messType if veg is selected
        selections: finalSelections,
        updatedAt: serverTimestamp()
      }
      
      // Save to Firestore with updated path
      const selectionsRef = doc(db, 'students', studentId, 'preferences', 'mealSelections')
      await setDoc(selectionsRef, selectionsData, { merge: true })
      
      // Update local state
      setStudentSelections(prev => ({
        ...prev,
        [studentId]: selectionsData
      }))
      
      return true
    } catch (error) {
      console.error('Error saving meal selections:', error)
      throw error
    }
  }

  // Add individual meal selection with veg/non-veg logic
  const addMealSelection = async (studentId, mealId, mealData) => {
    try {
      const selectionData = {
        [mealId]: {
          category: mealData.category,
          subcategory: mealData.subcategory,
          messType: mealData.messType,
          selectedAt: serverTimestamp()
        }
      }

      // Get current selections
      const currentSelections = studentSelections[studentId]?.selections || {}
      
      // Check if adding veg item
      if (mealData.messType === 'veg') {
        // Clear all non-veg selections when adding veg
        await clearNonVegSelections(studentId, {
          ...currentSelections,
          ...selectionData
        })
      } else if (mealData.messType === 'non-veg') {
        // Check if there are any existing veg selections
        const hasVegSelections = Object.values(currentSelections).some(
          selection => selection.messType === 'veg'
        )
        
        if (hasVegSelections) {
          toast.error('Cannot add non-veg items when veg items are already selected')
          return false
        }
      }

      // Proceed with normal save
      await saveStudentSelections(studentId, mealData.messType, {
        ...currentSelections,
        ...selectionData
      }, { [mealId]: mealData })

      toast.success('Meal selection added successfully!')
      return true
    } catch (error) {
      console.error('Error adding meal selection:', error)
      throw error
    }
  }

  // Remove meal selection
  const removeMealSelection = async (studentId, mealId) => {
    try {
      const currentSelections = { ...studentSelections[studentId]?.selections }
      delete currentSelections[mealId]

      const selectionsData = {
        selections: currentSelections,
        updatedAt: serverTimestamp()
      }

      const selectionsRef = doc(db, 'students', studentId, 'preferences', 'mealSelections')
      await setDoc(selectionsRef, selectionsData, { merge: true })

      // Update local state
      setStudentSelections(prev => ({
        ...prev,
        [studentId]: selectionsData
      }))

      toast.success('Meal selection removed successfully!')
      return true
    } catch (error) {
      console.error('Error removing meal selection:', error)
      throw error
    }
  }

  const addMeal = async (mealData) => {
    try {
      const mealWithTimestamps = {
        name: mealData.name,
        description: mealData.description || '',
        image: mealData.image || '',
        nutrition: mealData.nutrition || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        },
        tags: mealData.tags || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      // Build the correct path
      const mealsRef = collection(
        db, 
        'Meals', 
        mealData.messType, 
        'categories', 
        mealData.category, 
        'subcategories', 
        mealData.subcategory, 
        'items'
      )
      const docRef = await addDoc(mealsRef, mealWithTimestamps)
      
      toast.success('Meal added successfully!')
      return { 
        id: docRef.id, 
        path: `Meals/${mealData.messType}/categories/${mealData.category}/subcategories/${mealData.subcategory}/items/${docRef.id}` 
      }
    } catch (error) {
      toast.error('Error adding meal: ' + error.message)
      throw error
    }
  }

  const updateMeal = async (mealId, mealData, mealPath) => {
    try {
      const mealUpdate = {
        name: mealData.name,
        description: mealData.description || '',
        image: mealData.image || '',
        nutrition: mealData.nutrition || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        },
        tags: mealData.tags || [],
        updatedAt: serverTimestamp()
      }

      // Extract path components from mealPath (Meals/messType/categories/category/subcategories/subcategory/items/mealId)
      const pathParts = mealPath.split('/')
      const messType = pathParts[1]
      const category = pathParts[3]
      const subcategory = pathParts[5]
      
      const mealRef = doc(
        db, 
        'Meals', 
        messType, 
        'categories', 
        category, 
        'subcategories', 
        subcategory, 
        'items', 
        mealId
      )
      await updateDoc(mealRef, mealUpdate)
      
      // Update local state
      setMeals(prevMeals => 
        prevMeals.map(meal => 
          meal.id === mealId 
            ? { ...meal, ...mealUpdate, updatedAt: new Date() }
            : meal
        )
      )
      
      toast.success('Meal updated successfully!')
      return true
    } catch (error) {
      toast.error('Error updating meal: ' + error.message)
      throw error
    }
  }

  const deleteMeal = async (mealId, mealPath) => {
    try {
      // Extract path components from mealPath (Meals/messType/categories/category/subcategories/subcategory/items/mealId)
      const pathParts = mealPath.split('/')
      const messType = pathParts[1]
      const category = pathParts[3]
      const subcategory = pathParts[5]
      
      const mealRef = doc(
        db, 
        'Meals', 
        messType, 
        'categories', 
        category, 
        'subcategories', 
        subcategory, 
        'items', 
        mealId
      )
      await deleteDoc(mealRef)
      
      // Update local state
      setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId))
      
      toast.success('Meal deleted successfully!')
      return true
    } catch (error) {
      toast.error('Error deleting meal: ' + error.message)
      throw error
    }
  }

  const getMealsByCategory = (category) => {
    return meals.filter(meal => meal.category === category)
  }

  const getMealsBySubcategory = (category, subcategory) => {
    return meals.filter(meal => 
      meal.category === category && meal.subcategory === subcategory
    )
  }

  const getMealsByMessType = (messType) => {
    return meals.filter(meal => meal.messType === messType)
  }

  const getAllTags = () => {
    const allTags = meals.reduce((tags, meal) => {
      if (meal.tags && Array.isArray(meal.tags)) {
        return [...tags, ...meal.tags]
      }
      return tags
    }, [])
    
    return [...new Set(allTags)]
  }

  // Get recent meals
  const getRecentMeals = (limit = 5) => {
    return [...meals]
      .sort((a, b) => {
        const dateA = a.createdAt
        const dateB = b.createdAt
        return new Date(dateB) - new Date(dateA)
      })
      .slice(0, limit)
  }

  const value = {
    meals,
    categories,
    messTypes,
    loading,
    studentSelections,
    allStudents,
    addMeal,
    updateMeal,
    deleteMeal,
    getMealsByCategory,
    getMealsBySubcategory,
    getMealsByMessType,
    getAllTags,
    getSubcategories,
    getRecentMeals,
    fetchStudentSelections,
    saveStudentSelections,
    addMealSelection,
    removeMealSelection,
    clearNonVegSelections,
    fetchAllStudents,
    checkSubcategoryLimit,
    MAX_ITEMS
  }

  return (
    <MealContext.Provider value={value}>
      {children}
    </MealContext.Provider>
  )
}

// Custom hook - must be exported as a named export
export const useMeal = () => {
  const context = useContext(MealContext)
  if (!context) {
    throw new Error('useMeal must be used within a MealProvider')
  }
  return context
}

// Default export for the provider
export default MealProvider