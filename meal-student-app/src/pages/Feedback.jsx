import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useMeal } from '../context/MealContext';
import { Star, MessageSquare, Calendar } from 'lucide-react'
import FeedbackForm from '../components/FeedbackForm'
import Loader from '../components/Loader'

const Feedback = () => {
  const { currentUser } = useAuth()
  const { meals } = useMeal()
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [recentMeals, setRecentMeals] = useState([])

  useEffect(() => {
    // Get recent meals (last 7 days)
    const recent = meals
      .filter(meal => new Date(meal.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    
    setRecentMeals(recent)
    if (recent.length > 0 && !selectedMeal) {
      setSelectedMeal(recent[0].id)
    }
  }, [meals])

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
        <p className="text-gray-600 mb-6">You need to be signed in to provide feedback.</p>
        <a href="/auth" className="btn-primary">
          Sign In
        </a>
      </div>
    )
  }

  const selectedMealData = recentMeals.find(meal => meal.id === selectedMeal)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <MessageSquare size={32} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Meal Feedback</h1>
        <p className="text-gray-600 mt-2">
          Share your thoughts about recent meals to help us improve
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Meal</h2>
            <div className="space-y-3">
              {recentMeals.map(meal => (
                <button
                  key={meal.id}
                  onClick={() => setSelectedMeal(meal.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedMeal === meal.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">{meal.type}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Calendar size={14} className="mr-1" />
                        <span>{new Date(meal.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <Star size={16} className="fill-current" />
                      <span className="ml-1 text-sm font-medium">4.2</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 truncate">
                    {meal.items.slice(0, 3).map(item => item.name).join(', ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          {selectedMealData ? (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Feedback</h2>
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 capitalize">{selectedMealData.type}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(selectedMealData.date).toLocaleDateString()} • {selectedMealData.time}
                </p>
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-900">Menu:</h4>
                  <ul className="text-sm text-gray-600 mt-1">
                    {selectedMealData.items.map((item, index) => (
                      <li key={index}>• {item.name}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <FeedbackForm
                mealId={selectedMeal}
                initialRating={0}
                initialComment=""
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No recent meals available for feedback.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Feedback