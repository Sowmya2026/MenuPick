import { Utensils, Star } from 'lucide-react'
import { useMeal } from '../context/MealContext'

const RecentMeals = () => {
  const { getRecentMeals } = useMeal()
  const recentMeals = getRecentMeals(5)

  if (recentMeals.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Meals</h3>
        <div className="text-center py-8">
          <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No meals added yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Meals</h3>
      <div className="space-y-3">
        {recentMeals.map((meal) => (
          <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{meal.name}</p>
                <p className="text-sm text-gray-500 capitalize">{meal.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-yellow-600">
                <Star className="h-4 w-4 mr-1" />
                <span>{meal.rating || 'N/A'}</span>
              </div>
              <div className="text-sm text-gray-500">
                {meal.createdAt?.toDate?.()?.toLocaleDateString() || 
                 new Date(meal.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentMeals