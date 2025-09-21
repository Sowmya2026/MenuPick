import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  getCountFromServer,
  writeBatch,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'
import toast from 'react-hot-toast'

// Create context
const MealContext = createContext()

// Define maximum items for each subcategory
const MAX_ITEMS = {
  breakfast: {
    'veg': { 'Tiffin': 20, 'Chutney': 10 },
    'non-veg': { 'Tiffin': 20, 'Chutney': 10, 'Egg': 8 },
    'special': { 'Tiffin': 20, 'Chutney': 10, 'Egg': 8, 'Juices': 10 }
  },
  lunch: {
    'veg': { 'Rice': 10, 'Curry': 20, 'Accompaniments': 10, 'Dessert': 7 },
    'non-veg': { 'Rice': 10, 'Curry': 20, 'Accompaniments': 10, 'Dessert': 7, 'Chicken': 7 },
    'special': { 'Rice': 10, 'Curry': 20, 'Accompaniments': 10, 'Dessert': 7, 'Chicken': 7, 'Fish': 4 }
  },
  snacks: {
    'veg': { 'Snacks': 10 },
    'non-veg': { 'Snacks': 10 },
    'special': { 'Snacks': 10 }
  },
  dinner: {
    'veg': { 'Staples': 10, 'Curries': 20, 'Side Dishes': 10, 'Accompaniments': 10 },
    'non-veg': { 'Staples': 10, 'Curries': 20, 'Side Dishes': 10, 'Fish': 4 },
    'special': { 'Staples': 10, 'Curries': 20, 'Side Dishes': 10, 'Special Items': 7 }
  }
}

// Meal Provider Component
export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([])
  const [categories] = useState(['breakfast', 'lunch', 'snacks', 'dinner'])
  const [messTypes] = useState(['veg', 'non-veg', 'special'])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalMeals: 0,
    totalStudents: 0
  })

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

  // Helper function to check if a subcategory has reached its maximum items
  const checkSubcategoryLimit = useCallback((category, messType, subcategory) => {
    const currentItems = meals.filter(meal => 
      meal.category === category && 
      meal.messType === messType && 
      meal.subcategory === subcategory
    )
    
    const maxAllowed = MAX_ITEMS[category]?.[messType]?.[subcategory] || 0
    
    return {
      currentCount: currentItems.length,
      maxAllowed,
      hasReachedLimit: currentItems.length >= maxAllowed
    }
  }, [meals])

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
                // Create collection reference with proper path according to the recommended schema
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
  }, [])

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      // Get total meals count
      const mealsCount = meals.length
      
      // Get total students count
      let studentsCount = 1250
      try {
        const studentsCollection = collection(db, 'students')
        const studentsSnapshot = await getCountFromServer(studentsCollection)
        studentsCount = studentsSnapshot.data().count
      } catch (error) {
        console.warn('Could not fetch students count, using default:', error.message)
      }

      setStats({
        totalMeals: mealsCount,
        totalStudents: studentsCount
      })
    } catch (error) {
      toast.error('Error fetching stats: ' + error.message)
    }
  }, [meals])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const addMeal = async (mealData) => {
    try {
      // Check if subcategory has reached its limit
      const limitCheck = checkSubcategoryLimit(
        mealData.category, 
        mealData.messType, 
        mealData.subcategory
      )
      
      if (limitCheck.hasReachedLimit) {
        toast.error(`Cannot add more items to ${mealData.subcategory}. Maximum limit of ${limitCheck.maxAllowed} reached.`)
        return { error: `Maximum limit of ${limitCheck.maxAllowed} reached for ${mealData.subcategory}` }
      }

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

      // Build the correct path according to the recommended schema
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

  const addMultipleMeals = async (mealsData) => {
    try {
      // Group meals by their path (messType/category/subcategory)
      const mealsByPath = {}
      
      // First check all limits
      for (const mealData of mealsData) {
        const limitCheck = checkSubcategoryLimit(
          mealData.category, 
          mealData.messType, 
          mealData.subcategory
        )
        
        if (limitCheck.hasReachedLimit) {
          toast.error(`Cannot add more items to ${mealData.subcategory}. Maximum limit of ${limitCheck.maxAllowed} reached.`)
          return { error: `Maximum limit of ${limitCheck.maxAllowed} reached for ${mealData.subcategory}` }
        }
      }
      
      mealsData.forEach(mealData => {
        const path = `${mealData.messType}/${mealData.category}/${mealData.subcategory}`
        
        if (!mealsByPath[path]) {
          mealsByPath[path] = []
        }
        
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
        
        mealsByPath[path].push(mealWithTimestamps)
      })

      // Create batches for each path
      for (const [path, meals] of Object.entries(mealsByPath)) {
        const [messType, category, subcategory] = path.split('/')
        const batch = writeBatch(db)
        
        // Create collection reference with proper path according to the recommended schema
        const mealsRef = collection(
          db, 
          'Meals', 
          messType, 
          'categories', 
          category, 
          'subcategories', 
          subcategory, 
          'items'
        )
        
        meals.forEach(meal => {
          const docRef = doc(mealsRef)
          batch.set(docRef, meal)
        })
        
        await batch.commit()
      }
      
      toast.success(`${mealsData.length} meals added successfully!`)
      return true
    } catch (error) {
      toast.error('Error adding meals: ' + error.message)
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

  const getMealsByTags = (tags) => {
    return meals.filter(meal => 
      meal.tags && tags.some(tag => meal.tags.includes(tag))
    )
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
    stats,
    addMeal,
    addMultipleMeals,
    updateMeal,
    deleteMeal,
    getMealsByCategory,
    getMealsBySubcategory,
    getMealsByMessType,
    getMealsByTags,
    getAllTags,
    getSubcategories,
    getRecentMeals,
    fetchStats,
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