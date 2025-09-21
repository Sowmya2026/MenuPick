import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Calendar, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Leaf, Beef } from 'lucide-react'
import { useFeedback } from '../hooks/useFeedback'

const MealCard = ({ meal }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { likeMealItem, dislikeMealItem } = useFeedback()

  const previewItems = meal.items.slice(0, 3)
  const hasMoreItems = meal.items.length > 3

  const handleLike = (e) => {
    e.stopPropagation()
    likeMealItem(meal.id)
  }

  const handleDislike = (e) => {
    e.stopPropagation()
    dislikeMealItem(meal.id)
  }

  return (
    <div className="card animate-fade-in">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">{meal.type}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                meal.category === 'veg' 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : meal.category === 'non-veg'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-purple-100 text-purple-800 border border-purple-300'
              }`}>
                {meal.category === 'veg' ? 'VEG' : meal.category === 'non-veg' ? 'NON-VEG' : 'SPECIAL'}
              </span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <Calendar size={16} className="mr-1" />
              <span>{new Date(meal.date).toLocaleDateString()}</span>
              <Clock size={16} className="ml-3 mr-1" />
              <span>{meal.time}</span>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-700">
                {previewItems.map(item => item.name).join(', ')}
                {hasMoreItems && !isExpanded && '...'}
              </p>
            </div>
          </div>
          
          <button className="ml-2 p-1 hover:bg-gray-100 rounded">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center mt-3 space-x-2">
          <button
            onClick={handleLike}
            className="flex items-center text-green-600 hover:text-green-700 p-1 rounded transition-colors"
          >
            <ThumbsUp size={18} className="mr-1" />
            <span className="text-sm">Like ({meal.likes || 0})</span>
          </button>
          <button
            onClick={handleDislike}
            className="flex items-center text-red-600 hover:text-red-700 p-1 rounded transition-colors"
          >
            <ThumbsDown size={18} className="mr-1" />
            <span className="text-sm">Dislike ({meal.dislikes || 0})</span>
          </button>
          <Link 
            to={`/meal/${meal.id}`}
            onClick={(e) => e.stopPropagation()}
            className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View Details
          </Link>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mt-3 mb-2">Full Menu:</h4>
          <ul className="space-y-1">
            {meal.items.map((item, index) => (
              <li key={index} className="text-sm text-gray-700">
                • {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default MealCard