import { useState, useMemo, useEffect } from 'react'
import { useMeal } from '../context/MealContext'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, Utensils, AlertCircle, Save, RotateCcw, ChevronDown, ChevronUp, ChefHat, Calendar, Info, Edit3 } from 'lucide-react'
import toast from 'react-hot-toast'

const MealSelection = () => {
  const { meals, categories, loading, getSubcategories, checkSubcategoryLimit, saveStudentSelections, MAX_ITEMS, fetchStudentSelections } = useMeal()
  const { currentUser } = useAuth()
  const [selectedMeals, setSelectedMeals] = useState({})
  const [saving, setSaving] = useState(false)
  const [activeCategory, setActiveCategory] = useState('breakfast')
  const [activeSubcategory, setActiveSubcategory] = useState({})
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false)
  const [selectionLimits, setSelectionLimits] = useState({})
  const [mealDataMap, setMealDataMap] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [hasSavedSelections, setHasSavedSelections] = useState(false)

  // Get user's mess type from profile
  const userMessType = currentUser?.messPreference || 'veg'

  // Create a map of meal data for easy access
  useEffect(() => {
    const map = {}
    meals.forEach(meal => {
      map[meal.id] = meal
    })
    setMealDataMap(map)
  }, [meals])

  // Color scheme based on mess type
  const colorScheme = useMemo(() => {
    switch(userMessType) {
      case 'veg':
        return {
          primary: 'green',
          light: 'emerald',
          gradientFrom: 'from-green-50',
          gradientTo: 'to-emerald-50',
          text: 'text-green-700',
          bg: 'bg-green-100',
          border: 'border-green-200',
          hover: 'hover:bg-green-200',
          active: 'bg-green-600',
          badge: 'bg-green-100 text-green-800 border-green-200'
        }
      case 'non-veg':
        return {
          primary: 'red',
          light: 'orange',
          gradientFrom: 'from-red-50',
          gradientTo: 'to-orange-50',
          text: 'text-red-700',
          bg: 'bg-red-100',
          border: 'border-red-200',
          hover: 'hover:bg-red-200',
          active: 'bg-red-600',
          badge: 'bg-red-100 text-red-800 border-red-200'
        }
      case 'mixed':
      default:
        return {
          primary: 'purple',
          light: 'violet',
          gradientFrom: 'from-purple-50',
          gradientTo: 'to-violet-50',
          text: 'text-purple-700',
          bg: 'bg-purple-100',
          border: 'border-purple-200',
          hover: 'hover:bg-purple-200',
          active: 'bg-purple-600',
          badge: 'bg-purple-100 text-purple-800 border-purple-200'
        }
    }
  }, [userMessType])

  // Get filtered meals by user's mess type
  const filteredMeals = useMemo(() => {
    return meals.filter(meal => meal.messType === userMessType)
  }, [meals, userMessType])

  // Get all subcategories for each category
  const categorySubcategories = useMemo(() => {
    const subcats = {}
    categories.forEach(category => {
      subcats[category] = getSubcategories(category, userMessType)
    })
    return subcats
  }, [categories, userMessType, getSubcategories])

  // Set default subcategory for each category when it loads
  useEffect(() => {
    const initialSubcategories = {}
    categories.forEach(category => {
      if (categorySubcategories[category] && categorySubcategories[category].length > 0) {
        initialSubcategories[category] = categorySubcategories[category][0]
      }
    })
    setActiveSubcategory(initialSubcategories)
  }, [categories, categorySubcategories])

  // Get meals for the active category and subcategory
  const activeMeals = useMemo(() => {
    return filteredMeals.filter(meal => 
      meal.category === activeCategory && 
      meal.subcategory === activeSubcategory[activeCategory]
    )
  }, [filteredMeals, activeCategory, activeSubcategory])

  // Calculate selection counts
  const selectionCounts = useMemo(() => {
    return Object.keys(selectedMeals).length
  }, [selectedMeals])

  // Function to update selection limits
  const updateSelectionLimits = (selections) => {
    const limits = {}
    
    // Initialize limits for all categories and subcategories
    categories.forEach(category => {
      const subcategories = getSubcategories(category, userMessType)
      subcategories.forEach(subcategory => {
        const key = `${category}-${subcategory}`
        const currentCount = Object.values(selections).filter(selection => 
          selection.category === category && selection.subcategory === subcategory
        ).length
        
        const maxAllowed = MAX_ITEMS[category]?.[userMessType]?.[subcategory] || 0
        
        limits[key] = {
          currentCount,
          maxAllowed,
          hasReachedLimit: currentCount >= maxAllowed
        }
      })
    })
    
    setSelectionLimits(limits)
  }

  // Handle meal selection
  const handleMealSelect = (mealId) => {
    // Only allow selection if in edit mode or if selections haven't been saved yet
    if (hasSavedSelections && !isEditing) {
      toast.error('Please click "Edit Selections" to make changes')
      return
    }
    
    const meal = mealDataMap[mealId]
    if (!meal) return
    
    // Check if already selected
    if (selectedMeals[mealId]) {
      const updatedSelections = { ...selectedMeals }
      delete updatedSelections[mealId]
      setSelectedMeals(updatedSelections)
      updateSelectionLimits(updatedSelections)
      return
    }
    
    // Check limit before adding
    const limitCheck = checkSubcategoryLimit(
      meal.category,
      meal.messType,
      meal.subcategory,
      selectedMeals
    )
    
    if (limitCheck.hasReachedLimit) {
      toast.error(`Cannot select more than ${limitCheck.maxAllowed} items from ${meal.subcategory}`)
      return
    }
    
    // Add selection
    setSelectedMeals(prev => {
      const updated = {
        ...prev,
        [mealId]: { 
          timestamp: new Date().toISOString(),
          category: meal.category,
          subcategory: meal.subcategory
        }
      }
      updateSelectionLimits(updated)
      return updated
    })
  }

  // Clear all selections
  const clearSelections = () => {
    if (Object.keys(selectedMeals).length > 0) {
      if (window.confirm('Are you sure you want to clear all selections?')) {
        setSelectedMeals({})
        updateSelectionLimits({})
        toast.success('Selections cleared')
      }
    }
  }

  // Save selections
  const saveSelections = async () => {
    if (selectionCounts === 0) {
      toast.error('Please select at least one meal')
      return
    }
    
    setSaving(true)
    try {
      // Save to context (which will save to Firestore)
      await saveStudentSelections(currentUser.uid, userMessType, selectedMeals, mealDataMap)
      
      // Clear localStorage to avoid conflicts
      localStorage.removeItem('mealSelections')
      
      setHasSavedSelections(true)
      setIsEditing(false)
      toast.success('Meal selections saved successfully!')
    } catch (error) {
      console.error('Error saving selections:', error)
      toast.error('Failed to save selections')
    } finally {
      setSaving(false)
    }
  }

  // Enable edit mode
  const enableEditMode = () => {
    setIsEditing(true)
    toast.success('You can now edit your selections')
  }

  // Cancel edit mode and reload original selections
  const cancelEdit = async () => {
    try {
      // Reload selections from Firestore
      const savedSelections = await fetchStudentSelections(currentUser.uid)
      if (savedSelections && savedSelections.selections) {
        setSelectedMeals(savedSelections.selections)
        updateSelectionLimits(savedSelections.selections)
      } else {
        setSelectedMeals({})
        updateSelectionLimits({})
      }
      setIsEditing(false)
      toast.success('Edit mode cancelled')
    } catch (error) {
      console.error('Error loading saved selections:', error)
      toast.error('Failed to load saved selections')
    }
  }

  // Load saved selections from Firestore on component mount
  useEffect(() => {
    const loadSavedSelections = async () => {
      if (currentUser?.uid) {
        try {
          const savedSelections = await fetchStudentSelections(currentUser.uid)
          if (savedSelections && savedSelections.selections) {
            setSelectedMeals(savedSelections.selections)
            updateSelectionLimits(savedSelections.selections)
            setHasSavedSelections(true)
          }
        } catch (error) {
          console.error('Error loading saved selections:', error)
        }
      }
    }

    loadSavedSelections()
  }, [currentUser, fetchStudentSelections])

  // Add a function to check if a meal can be selected
  const canSelectMeal = (meal) => {
    if (!meal) return false
    
    const limitCheck = checkSubcategoryLimit(
      meal.category,
      meal.messType,
      meal.subcategory,
      selectedMeals
    )
    
    return !limitCheck.hasReachedLimit || !!selectedMeals[meal.id]
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-12 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  // Selection Summary Component
  const SelectionSummary = () => {
    return (
      <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
          <Info className="h-4 w-4 mr-1.5 text-blue-500" />
          Selection Limits Summary
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map(category => {
            const subcategories = getSubcategories(category, userMessType)
            return subcategories.map(subcategory => {
              const key = `${category}-${subcategory}`
              const limit = selectionLimits[key] || { currentCount: 0, maxAllowed: 0 }
              
              return (
                <div key={key} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700 capitalize">
                      {category} - {subcategory}
                    </span>
                    <span className={`text-xs font-semibold ${
                      limit.currentCount >= limit.maxAllowed ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {limit.currentCount}/{limit.maxAllowed}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        limit.currentCount >= limit.maxAllowed ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (limit.currentCount / limit.maxAllowed) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )
            })
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Monthly Meal Selection</h1>
          <p className="text-gray-600">Plan your meals for the upcoming month</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {hasSavedSelections && !isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={enableEditMode}
              className={`px-4 py-2 bg-${colorScheme.primary}-100 text-${colorScheme.primary}-800 rounded-lg flex items-center transition-all hover:bg-${colorScheme.primary}-200 border ${colorScheme.border}`}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Selections
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isEditing ? cancelEdit : clearSelections}
                className={`px-4 py-2 bg-gray-100 text-gray-800 rounded-lg flex items-center transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${colorScheme.border}`}
                disabled={Object.keys(selectedMeals).length === 0 && !isEditing}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel Edit
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear All
                  </>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveSelections}
                className={`px-4 py-2 bg-${colorScheme.primary}-600 text-white rounded-lg flex items-center transition-all hover:bg-${colorScheme.primary}-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={saving || selectionCounts === 0}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? 'Update Selections' : 'Save Selections'}
                  </>
                )}
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Status Banner */}
      {hasSavedSelections && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl border ${isEditing ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}
        >
          <div className="flex items-center">
            {isEditing ? (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium">
                  You are in edit mode. Make your changes and click "Update Selections" to save.
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-800 font-medium">
                  Your meal selections have been saved. Click "Edit Selections" to make changes.
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8"
      >
        {/* Header Section */}
        <div className={`bg-gradient-to-r ${colorScheme.gradientFrom} ${colorScheme.gradientTo} p-6 border-b ${colorScheme.border}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <ChefHat className={`h-6 w-6 mr-2 text-${colorScheme.primary}-600`} />
                Meal Selection
              </h2>
              <p className="text-gray-600 mt-1">Customize your monthly meal plan</p>
            </div>
            
            <div className={`flex items-center bg-white rounded-lg px-4 py-2 shadow-sm border ${colorScheme.border}`}>
              <div className={`h-3 w-3 rounded-full mr-2 ${
                userMessType === 'veg' ? 'bg-green-500' : 
                userMessType === 'non-veg' ? 'bg-red-500' : 'bg-purple-500'
              }`}></div>
              <span className="font-medium text-gray-800 capitalize mr-2">
                {userMessType} Mess
              </span>
              <span className="text-sm text-gray-600">
                ({filteredMeals.length} meals available)
              </span>
            </div>
          </div>
        </div>

        {/* Info and Selection Summary */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-start mb-4 md:mb-0">
              <Info className={`h-5 w-5 text-${colorScheme.primary}-600 mr-2 mt-0.5`} />
              <p className="text-sm text-gray-700">
                Your mess type is set to {userMessType}. To change your mess type, please contact the mess administrator.
              </p>
            </div>
            
            <div className={`bg-gray-100 rounded-lg px-4 py-2 border ${colorScheme.border}`}>
              <p className="text-sm text-gray-800">
                <span className={`font-semibold text-${colorScheme.primary}-600`}>{selectionCounts}</span> meals selected
              </p>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className={`h-5 w-5 mr-2 text-${colorScheme.primary}-600`} />
            Select Category
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <motion.button
                key={category}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-3 rounded-xl transition-all flex items-center ${
                  activeCategory === category
                    ? `bg-${colorScheme.primary}-600 text-white shadow-md`
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setActiveCategory(category)
                  setShowSubcategoryDropdown(false)
                }}
              >
                <span className="capitalize font-medium">{category}</span>
                {activeCategory === category && (
                  <ChevronDown 
                    className="h-4 w-4 ml-2" 
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowSubcategoryDropdown(!showSubcategoryDropdown)
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Subcategory Dropdown */}
          <AnimatePresence>
            {showSubcategoryDropdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`mt-4 bg-gray-50 rounded-xl p-4 border ${colorScheme.border}`}
              >
                <h4 className="text-sm font-medium text-gray-800 mb-2">Select Subcategory</h4>
                <div className="flex flex-wrap gap-2">
                  {categorySubcategories[activeCategory]?.map(subcategory => (
                    <motion.button
                      key={subcategory}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSubcategory[activeCategory] === subcategory
                          ? `${colorScheme.bg} ${colorScheme.text} border ${colorScheme.border}`
                          : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setActiveSubcategory(prev => ({
                          ...prev,
                          [activeCategory]: subcategory
                        }))
                        setShowSubcategoryDropdown(false)
                      }}
                    >
                      <span className="capitalize">{subcategory}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active Category Title */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900 capitalize flex items-center">
            <Utensils className={`h-5 w-5 mr-2 text-${colorScheme.primary}-600`} />
            {activeCategory} - {activeSubcategory[activeCategory]}
          </h2>
          <p className="text-sm text-gray-700 mt-1">
            Select your preferred meals from the options below
          </p>
        </div>

        {/* Meal Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeMeals.length > 0 ? (
              activeMeals.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  isSelected={!!selectedMeals[meal.id]}
                  onSelect={handleMealSelect}
                  colorScheme={colorScheme}
                  selectedMeals={selectedMeals}
                  checkSubcategoryLimit={checkSubcategoryLimit}
                  isEditing={isEditing}
                  hasSavedSelections={hasSavedSelections}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-center h-16 w-16 bg-white rounded-lg mx-auto mb-4 shadow-sm border border-gray-200">
                  <Utensils className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-700 text-lg font-medium">No meals available for this selection</p>
                <p className="text-gray-600 text-sm mt-2">
                  Please try a different category or subcategory
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Selection Summary */}
      <SelectionSummary />
    </div>
  )
}

// Meal Card Component
const MealCard = ({ 
  meal, 
  isSelected, 
  onSelect,
  colorScheme,
  selectedMeals,
  checkSubcategoryLimit,
  isEditing,
  hasSavedSelections
}) => {
  const limitCheck = checkSubcategoryLimit(
    meal.category,
    meal.messType,
    meal.subcategory,
    selectedMeals
  )
  
  const isLimitReached = limitCheck.hasReachedLimit && !isSelected
  const canSelect = !isLimitReached && (isEditing || !hasSavedSelections)
  
  return (
    <motion.div
      className={`border rounded-xl p-5 transition-all relative overflow-hidden ${
        isSelected
          ? `border-${colorScheme.primary}-500 bg-${colorScheme.primary}-50 shadow-md`
          : isLimitReached
          ? 'border-gray-300 bg-gray-100 opacity-70'
          : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
      } ${!canSelect && !isSelected ? 'opacity-60' : ''}`}
      whileHover={canSelect ? { y: -5 } : {}}
      transition={{ duration: 0.2 }}
    >
      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle className={`h-6 w-6 text-${colorScheme.primary}-600`} />
        </div>
      )}
      
      {isLimitReached && (
        <div className="absolute top-3 right-3">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0 h-16 w-16 rounded-xl overflow-hidden flex items-center justify-center bg-gray-100 shadow-inner border border-gray-200">
            {meal.image ? (
              <img 
                src={meal.image} 
                alt={meal.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Utensils className="h-7 w-7 text-gray-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-gray-900 mb-1">{meal.name}</h4>
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{meal.description}</p>
            
            {meal.nutrition && (
              <div className="mb-3 flex flex-wrap gap-2">
                {meal.nutrition.calories > 0 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {meal.nutrition.calories} cal
                  </span>
                )}
                {meal.nutrition.protein > 0 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    {meal.nutrition.protein}g protein
                  </span>
                )}
              </div>
            )}
            
            {meal.tags && meal.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {meal.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Show selection limit info */}
            {!isSelected && (
              <div className="mt-2 text-xs text-gray-600">
                {limitCheck.currentCount} of {limitCheck.maxAllowed} selected in {meal.subcategory}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <motion.button
        whileHover={canSelect ? { scale: 1.05 } : {}}
        whileTap={canSelect ? { scale: 0.95 } : {}}
        onClick={() => canSelect && onSelect(meal.id)}
        disabled={!canSelect}
        className={`w-full mt-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center ${
          isSelected
            ? `${colorScheme.bg} ${colorScheme.text} hover:${colorScheme.hover} border ${colorScheme.border}`
            : !canSelect
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
        }`}
      >
        {isSelected ? (
          <>
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Selected
          </>
        ) : !canSelect ? (
          hasSavedSelections && !isEditing ? 'Edit to change' : 'Limit Reached'
        ) : (
          'Select Meal'
        )}
      </motion.button>
    </motion.div>
  )
}

export default MealSelection