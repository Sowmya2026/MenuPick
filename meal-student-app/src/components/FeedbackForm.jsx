import { useState } from 'react'
import { Star, Send, Utensils, Calendar } from 'lucide-react'

const FeedbackForm = ({ mealId, mealName, initialRating = 0, initialComment = '' }) => {
  const [rating, setRating] = useState(initialRating)
  const [comment, setComment] = useState(initialComment)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    try {
      // In a real app, you would call your API here
      console.log('Submitting feedback:', { mealId, rating, comment })
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSubmitted(true)
      
      // Reset form after successful submission (optional)
      setTimeout(() => {
        setRating(0)
        setComment('')
        setSubmitted(false)
      }, 2000)
      
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (star) => {
    setRating(star)
  }

  const handleHoverRating = (star) => {
    // Optional: Add hover effects if desired
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Thank You!</h3>
          <p className="text-gray-600">Your feedback has been submitted successfully.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-blue-100 rounded-lg mr-3">
          <Utensils size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Meal Feedback</h2>
          {mealName && (
            <p className="text-gray-600 text-sm flex items-center">
              <Calendar size={14} className="mr-1" />
              Rating for: {mealName}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How would you rate this meal?
          </label>
          <div className="flex space-x-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleHoverRating(star)}
                onMouseLeave={() => handleHoverRating(0)}
                className="p-2 focus:outline-none transform transition-transform hover:scale-110"
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
              >
                <Star
                  size={32}
                  className={
                    star <= rating 
                      ? 'text-yellow-400 fill-current drop-shadow-sm' 
                      : 'text-gray-300'
                  }
                />
              </button>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-500">
              {rating === 0 ? 'Select your rating' : `${rating} star${rating !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Share your experience (optional)
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="What did you like about this meal? Any suggestions for improvement?"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">How is your feedback used?</h4>
          <p className="text-xs text-gray-600">
            Your ratings help us improve our meal selections and tailor future menus to your preferences.
          </p>
        </div>

        <button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} className="mr-2" />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default FeedbackForm