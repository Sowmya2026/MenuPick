import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Copy, ChevronUp, ChevronDown, Upload, Image, CheckCircle } from 'lucide-react'
import { useMeal } from '../context/MealContext'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

// Color scheme for different mess types
const messTypeColors = {
  veg: {
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
    primary: "green",
    gradient: "from-green-400 to-emerald-500",
    progress: "text-green-600",
    light: "bg-green-100",
    card: "bg-gradient-to-br from-green-50 to-emerald-50",
    badge: "bg-green-500",
  },
  "non-veg": {
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    primary: "red",
    gradient: "from-red-400 to-orange-500",
    progress: "text-red-600",
    light: "bg-red-100",
    card: "bg-gradient-to-br from-red-50 to-orange-50",
    badge: "bg-red-500",
  },
  special: {
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
    primary: "purple",
    gradient: "from-purple-400 to-violet-500",
    progress: "text-purple-600",
    light: "bg-purple-100",
    card: "bg-gradient-to-br from-purple-50 to-violet-50",
    badge: "bg-purple-500",
  },
};

const MealForm = ({ meal, isOpen, onClose }) => {
  const { addMeal, updateMeal, addMultipleMeals, categories, messTypes, getSubcategories } = useMeal()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('breakfast')
  const [selectedMessType, setSelectedMessType] = useState('veg')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [addedMeals, setAddedMeals] = useState({})
  const [mealRows, setMealRows] = useState([
    {
      id: Date.now(),
      name: '',
      description: '',
      image: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      tags: []
    }
  ])

  // Get current color theme based on selected mess type
  const currentColors = messTypeColors[selectedMessType] || messTypeColors.veg

  // Get current subcategories based on both category AND mess type
  const currentSubcategories = getSubcategories(selectedCategory, selectedMessType)

  useEffect(() => {
    if (currentSubcategories.length > 0 && !selectedSubcategory) {
      setSelectedSubcategory(currentSubcategories[0])
    }
  }, [currentSubcategories, selectedSubcategory])

  useEffect(() => {
    if (meal) {
      // For editing a single meal, populate the form with existing data
      setSelectedCategory(meal.category || 'breakfast')
      setSelectedMessType(meal.messType || 'veg')
      setSelectedSubcategory(meal.subcategory || '')
      setMealRows([{
        id: meal.id || Date.now(),
        name: meal.name || '',
        description: meal.description || '',
        image: meal.image || '',
        calories: meal.nutrition?.calories || '',
        protein: meal.nutrition?.protein || '',
        carbs: meal.nutrition?.carbs || '',
        fat: meal.nutrition?.fat || '',
        tags: meal.tags || []
      }])
    } else {
      // Reset for new meal addition
      setSelectedCategory('breakfast')
      setSelectedMessType('veg')
      setSelectedSubcategory(currentSubcategories[0] || '')
      setAddedMeals({})
      setMealRows([{
        id: Date.now(),
        name: '',
        description: '',
        image: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        tags: []
      }])
    }
  }, [meal, isOpen])

  const addNewRow = () => {
    setMealRows([...mealRows, {
      id: Date.now() + Math.random(),
      name: '',
      description: '',
      image: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      tags: []
    }])
  }

  const removeRow = (id) => {
    if (mealRows.length > 1) {
      setMealRows(mealRows.filter(row => row.id !== id))
    }
  }

  const duplicateRow = (index) => {
    const rowToDuplicate = mealRows[index]
    const newRow = {
      ...rowToDuplicate,
      id: Date.now() + Math.random(),
      name: rowToDuplicate.name + ' (Copy)',
      image: '' // Don't duplicate the image
    }
    const newRows = [...mealRows]
    newRows.splice(index + 1, 0, newRow)
    setMealRows(newRows)
  }

  const moveRow = (index, direction) => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === mealRows.length - 1)) {
      return
    }
    
    const newRows = [...mealRows]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newRows[index], newRows[targetIndex]] = [newRows[targetIndex], newRows[index]]
    setMealRows(newRows)
  }

  const updateRow = (index, field, value) => {
    const newRows = [...mealRows]
    newRows[index] = {
      ...newRows[index],
      [field]: value
    }
    setMealRows(newRows)
  }

  const toggleTag = (rowIndex, tag) => {
    const newRows = [...mealRows]
    const currentTags = newRows[rowIndex].tags || []
    
    if (currentTags.includes(tag)) {
      newRows[rowIndex].tags = currentTags.filter(t => t !== tag)
    } else {
      newRows[rowIndex].tags = [...currentTags, tag]
    }
    
    setMealRows(newRows)
  }

  const handleImageUpload = (file, rowIndex) => {
    if (!file) return
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file (jpg, png, gif, etc.)')
      return
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Please select an image smaller than 2MB')
      return
    }
    
    setUploading(true)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      // Store the base64 string
      updateRow(rowIndex, 'image', e.target.result)
      setUploading(false)
    }
    reader.onerror = () => {
      alert('Error reading file. Please try again.')
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveSubcategory = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const mealsData = mealRows.filter(row => row.name.trim() !== '').map(row => ({
        name: row.name,
        description: row.description,
        image: row.image,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        messType: selectedMessType,
        nutrition: {
          calories: parseInt(row.calories) || 0,
          protein: parseInt(row.protein) || 0,
          carbs: parseInt(row.carbs) || 0,
          fat: parseInt(row.fat) || 0
        },
        tags: row.tags
      }))

      if (mealsData.length === 0) {
        toast.error('Please add at least one meal with a name')
        setLoading(false)
        return
      }

      if (meal) {
        // Update single meal
        await updateMeal(meal.id, mealsData[0], meal.path)
        toast.success('Meal updated successfully!')
        onClose()
      } else {
        // Add multiple meals
        await addMultipleMeals(mealsData)
        
        // Store added meals for display
        setAddedMeals(prev => ({
          ...prev,
          [selectedSubcategory]: mealsData
        }))
        
        // Reset form for next subcategory
        setMealRows([{
          id: Date.now(),
          name: '',
          description: '',
          image: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          tags: []
        }])
        
        toast.success(`Saved ${mealsData.length} meals for ${selectedSubcategory}!`)
      }
    } catch (error) {
      console.error('Error saving meals:', error)
      toast.error('Error saving meals: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalCalories = () => {
    return mealRows.reduce((total, row) => total + (parseInt(row.calories) || 0), 0)
  }

  const navigateToSubcategory = (subcategory) => {
    setSelectedSubcategory(subcategory)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        >
          <div className={`flex items-center justify-between p-6 border-b ${currentColors.bg}`}>
            <h2 className={`text-xl font-semibold ${currentColors.text}`}>
              {meal ? 'Edit Meal' : `Add ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Meals`}
            </h2>
            <button
              onClick={onClose}
              className={`text-gray-600 hover:${currentColors.text}`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSaveSubcategory} className="p-6 space-y-6">
            {/* Progress indicator with dropdown */}
            {!meal && (
              <div className={`${currentColors.bg} p-4 rounded-lg border ${currentColors.border}`}>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Progress</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="label">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        const newSubcategories = getSubcategories(e.target.value, selectedMessType)
                        setSelectedSubcategory(newSubcategories[0] || '')
                        setAddedMeals({})
                      }}
                      className={`input-field border ${currentColors.border} focus:ring-${currentColors.primary}-500 focus:border-${currentColors.primary}-500`}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="label">Mess Type</label>
                    <select
                      value={selectedMessType}
                      onChange={(e) => {
                        setSelectedMessType(e.target.value)
                        const newSubcategories = getSubcategories(selectedCategory, e.target.value)
                        setSelectedSubcategory(newSubcategories[0] || '')
                        setAddedMeals({})
                      }}
                      className={`input-field border ${currentColors.border} focus:ring-${currentColors.primary}-500 focus:border-${currentColors.primary}-500`}
                    >
                      {messTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="label">Subcategory</label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className={`input-field border ${currentColors.border} focus:ring-${currentColors.primary}-500 focus:border-${currentColors.primary}-500`}
                    >
                      {currentSubcategories.map(subcategory => (
                        <option key={subcategory} value={subcategory}>
                          {subcategory}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Progress indicators */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {currentSubcategories.map((subcategory) => (
                      <motion.div
                        key={subcategory}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all ${
                          addedMeals[subcategory]
                            ? `bg-${currentColors.primary}-100 text-${currentColors.primary}-800`
                            : subcategory === selectedSubcategory
                            ? `${currentColors.light} ${currentColors.text}`
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        onClick={() => navigateToSubcategory(subcategory)}
                      >
                        {addedMeals[subcategory] && <CheckCircle className="h-4 w-4 inline mr-1" />}
                        {subcategory}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Show previously added meals */}
            {!meal && Object.keys(addedMeals).length > 0 && (
              <div className={`${currentColors.bg} p-4 rounded-lg border ${currentColors.border}`}>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Added Meals</h3>
                <div className="space-y-3">
                  {Object.entries(addedMeals).map(([subcategory, meals]) => (
                    <motion.div 
                      key={subcategory} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border ${currentColors.border} rounded-lg p-3 bg-white shadow-sm`}
                    >
                      <h4 className="font-medium text-gray-700 mb-2">{subcategory}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {meals.map((meal, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center space-x-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {meal.image && (
                              <img 
                                src={meal.image} 
                                alt={meal.name} 
                                className="h-10 w-10 object-cover rounded"
                              />
                            )}
                            <span className="text-sm">{meal.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Meal Rows */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Add Meals for {selectedSubcategory}</h3>
                <motion.button
                  type="button"
                  onClick={addNewRow}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`btn-outline flex items-center text-sm border ${currentColors.border} text-${currentColors.primary}-600 hover:bg-${currentColors.primary}-50`}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Meal
                </motion.button>
              </div>

              {mealRows.map((row, index) => (
                <motion.div 
                  key={row.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${currentColors.card} shadow-sm`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-medium text-gray-700">Meal #{index + 1}</span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => moveRow(index, 'up')}
                        disabled={index === 0}
                        className={`text-gray-500 hover:text-${currentColors.primary}-600 disabled:opacity-30`}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveRow(index, 'down')}
                        disabled={index === mealRows.length - 1}
                        className={`text-gray-500 hover:text-${currentColors.primary}-600 disabled:opacity-30`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateRow(index)}
                        className={`text-${currentColors.primary}-500 hover:text-${currentColors.primary}-700`}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        disabled={mealRows.length === 1}
                        className="text-red-500 hover:text-red-700 disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="label">Meal Name *</label>
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => updateRow(index, 'name', e.target.value)}
                        className={`input-field border ${currentColors.border} focus:ring-${currentColors.primary}-500 focus:border-${currentColors.primary}-500`}
                        required
                        placeholder="e.g., Idli, Dosa, Paneer Butter Masala"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="label">Description</label>
                    <textarea
                      value={row.description}
                      onChange={(e) => updateRow(index, 'description', e.target.value)}
                      rows={2}
                      className={`input-field border ${currentColors.border} focus:ring-${currentColors.primary}-500 focus:border-${currentColors.primary}-500`}
                      placeholder="Describe the meal..."
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="mb-4">
                    <label className="label">Meal Image</label>
                    <div className="flex items-center space-x-4">
                      {row.image ? (
                        <motion.div 
                          className="flex items-center space-x-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <img 
                            src={row.image} 
                            alt="Meal preview" 
                            className="h-16 w-16 object-cover rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => updateRow(index, 'image', '')}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </motion.div>
                      ) : (
                        <div className={`flex items-center justify-center w-16 h-16 border-2 border-dashed ${currentColors.border} rounded-lg`}>
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <label className={`flex items-center justify-center px-4 py-2 border ${currentColors.border} rounded-md cursor-pointer hover:${currentColors.bg} transition-colors`}>
                          <Upload className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {uploading ? 'Uploading...' : 'Upload Image'}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                handleImageUpload(e.target.files[0], index)
                              }
                            }}
                            disabled={uploading}
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max 2MB)</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="label">Calories</label>
                      <input
                        type="number"
                        value={row.calories}
                        onChange={(e) => updateRow(index, 'calories', e.target.value)}
                        className={`input-field border ${currentColors.border} focus:ring-${currentColors.primary}-500 focus:border-${currentColors.primary}-500`}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="label">Protein (g)</label>
                      <input
                        type="number"
                        value={row.protein}
                        onChange={(e) => updateRow(index, 'protein', e.target.value)}
                        className={`input-field border ${currentColors.border} focus:ring-${currentColors.primary}-500 focus:border-${currentColors.primary}-500`}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="label">Carbs (g)</label>
                      <input
                        type="number"
                        value={row.carbs}
                        onChange={(e) => updateRow(index, 'carbs', e.target.value)}
                        className={`input-field border ${currentColors.border} focus:ring-${currentColors.primary}-500 focus:border-${currentColors.primary}-500`}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="label">Fat (g)</label>
                      <input
                        type="number"
                        value={row.fat}
                        onChange={(e) => updateRow(index, 'fat', e.target.value)}
                        className={`input-field border ${currentColors.border} focus:ring-${currentColors.primary}-500 focus:border-${currentColors.primary}-500`}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="label">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {['High-Protein', 'Vegan', 'Spicy', 'Gluten-Free', 'Low-Carb', 'Dairy-Free'].map(tag => (
                        <motion.button
                          type="button"
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleTag(index, tag)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            row.tags.includes(tag) 
                              ? `bg-${currentColors.primary}-100 text-${currentColors.primary}-800` 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary and Actions */}
            <div className={`${currentColors.bg} p-4 rounded-lg border ${currentColors.border} flex justify-between items-center`}>
              <div>
                <p className="text-sm text-gray-600">
                  Total Calories: <span className="font-medium">{calculateTotalCalories()}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Total Meals: <span className="font-medium">{mealRows.filter(row => row.name.trim() !== '').length}</span>
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="btn-outline"
                  disabled={loading || uploading}
                >
                  Cancel
                </motion.button>
                
                {meal ? (
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-${currentColors.primary}-600 hover:bg-${currentColors.primary}-700 text-white px-4 py-2 rounded-lg font-medium transition-colors`}
                    disabled={loading || uploading}
                  >
                    {loading ? 'Updating...' : 'Update Meal'}
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-${currentColors.primary}-600 hover:bg-${currentColors.primary}-700 text-white px-4 py-2 rounded-lg font-medium transition-colors`}
                    disabled={loading || uploading}
                  >
                    {loading ? 'Saving...' : `Save ${selectedSubcategory} Meals`}
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default MealForm