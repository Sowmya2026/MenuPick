import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useFeedback } from '../hooks/useFeedback'
import { Clock, Calendar, Utensils, ArrowLeft, Leaf, Beef, Star, Flame, Dumbbell, Wheat, Droplets } from 'lucide-react'
import FeedbackForm from '../components/FeedbackForm'
import Loader from '../components/Loader'

// Hardcoded meal details with enhanced information
const mealDetails = {
  '1': {
    name: 'Paneer Butter Masala',
    description: 'A rich and creamy North Indian dish made with soft paneer cubes in a tomato-based gravy with butter and spices. Served with naan or rice.',
    nutrition: {
      calories: 350,
      protein: '15g',
      carbs: '20g',
      fat: '25g'
    },
    ingredients: ['Paneer', 'Tomatoes', 'Butter', 'Cream', 'Spices', 'Cashews', 'Onions', 'Ginger', 'Garlic'],
    allergens: ['Dairy', 'Nuts'],
    category: 'veg',
    image: '/api/placeholder/400/300',
    rating: 4.5,
    ratingCount: 24
  },
  '2': {
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice cooked with tender chicken pieces, aromatic spices, and herbs. A classic Mughlai dish that is both flavorful and satisfying.',
    nutrition: {
      calories: 450,
      protein: '25g',
      carbs: '60g',
      fat: '15g'
    },
    ingredients: ['Basmati Rice', 'Chicken', 'Spices', 'Herbs', 'Yogurt', 'Onions', 'Ghee', 'Saffron'],
    allergens: ['Dairy'],
    category: 'non-veg',
    image: '/api/placeholder/400/300',
    rating: 4.2,
    ratingCount: 18
  },
  '3': {
    name: 'Special Thali',
    description: 'A complete meal featuring a variety of dishes including dal, vegetables, rice, roti, salad, and dessert. Perfect for those who want to try everything.',
    nutrition: {
      calories: 550,
      protein: '20g',
      carbs: '75g',
      fat: '18g'
    },
    ingredients: ['Mixed Vegetables', 'Dal', 'Rice', 'Roti', 'Salad', 'Raita', 'Dessert'],
    allergens: ['Dairy', 'Gluten'],
    category: 'special',
    image: '/api/placeholder/400/300',
    rating: 4.8,
    ratingCount: 32
  }
}

const MealDetail = () => {
  const { id } = useParams()
  const { feedback, loadMealFeedback } = useFeedback()
  const [meal, setMeal] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching meal data
    const fetchMealData = async () => {
      setIsLoading(true)
      // In a real app, this would come from your API/context
      const mockMeal = {
        id: id,
        type: 'Lunch',
        date: new Date().toISOString(),
        time: '12:30 PM - 2:00 PM',
        category: mealDetails[id]?.category || 'veg',
        items: [
          { name: mealDetails[id]?.name || 'Main Course', id: id },
          { name: 'Naan', id: 'bread-1' },
          { name: 'Rice', id: 'rice-1' },
          { name: 'Salad', id: 'salad-1' },
          { name: 'Raita', id: 'raita-1' }
        ],
        likes: 15,
        dislikes: 2
      }
      setMeal(mockMeal)
      
      // Load feedback for this meal
      await loadMealFeedback(id)
      setIsLoading(false)
    }

    fetchMealData()
  }, [id])

  if (isLoading) {
    return <Loader />
  }

  if (!meal) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Meal not found</h2>
        <a href="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          ← Back to Home
        </a>
      </div>
    )
  }

  const detail = mealDetails[id] || {}

  const NutritionItem = ({ icon, title, value }) => (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-2 bg-blue-100 rounded-lg mr-3">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <a href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </a>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">{meal.type}</h1>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Calendar size={16} className="mr-1" />
                  <span>{new Date(meal.date).toLocaleDateString()}</span>
                  <Clock size={16} className="ml-3 mr-1" />
                  <span>{meal.time}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                detail.category === 'veg' 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : detail.category === 'non-veg'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-purple-100 text-purple-800 border border-purple-300'
              }`}>
                {detail.category === 'veg' ? 'VEG' : detail.category === 'non-veg' ? 'NON-VEG' : 'SPECIAL'}
              </div>
            </div>

            {detail.image && (
              <img
                src={detail.image}
                alt={detail.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700">{detail.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Nutrition Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <NutritionItem 
                  icon={<Flame size={20} className="text-orange-500" />}
                  title="Calories"
                  value={`${detail.nutrition?.calories || 'N/A'} kcal`}
                />
                <NutritionItem 
                  icon={<Dumbbell size={20} className="text-blue-500" />}
                  title="Protein"
                  value={detail.nutrition?.protein || 'N/A'}
                />
                <NutritionItem 
                  icon={<Wheat size={20} className="text-amber-500" />}
                  title="Carbs"
                  value={detail.nutrition?.carbs || 'N/A'}
                />
                <NutritionItem 
                  icon={<Droplets size={20} className="text-red-500" />}
                  title="Fat"
                  value={detail.nutrition?.fat || 'N/A'}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Allergens</h3>
              <div className="flex flex-wrap gap-2">
                {detail.allergens?.map(allergen => (
                  <span key={allergen} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    {allergen}
                  </span>
                )) || <span className="text-gray-500">None reported</span>}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {detail.ingredients?.map(ingredient => (
                  <span key={ingredient} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {ingredient}
                  </span>
                )) || <span className="text-gray-500">Not specified</span>}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Utensils size={20} className="mr-2" />
              Full Menu
            </h2>
            <ul className="space-y-3">
              {meal.items.map((item, index) => (
                <li key={index} className="flex items-center py-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-900">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rate this Meal</h2>
            <FeedbackForm
              mealId={id}
              initialRating={feedback[id]?.rating || 0}
              initialComment={feedback[id]?.comment || ''}
            />
          </div>

          <div className="card p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Feedback</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-yellow-500">★ {detail.rating || '4.2'}</div>
                <div className="ml-2 text-sm text-gray-600">({detail.ratingCount || '18'} ratings)</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-green-600 font-semibold">{meal.likes || 0}</div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-semibold">{meal.dislikes || 0}</div>
                  <div className="text-sm text-gray-600">Dislikes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MealDetail