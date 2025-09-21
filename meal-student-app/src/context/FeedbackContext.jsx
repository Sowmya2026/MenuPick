/* eslint-disable no-unused-vars */
import { createContext, useState } from 'react'
import { submitFeedback, getMealFeedback, likeMeal, dislikeMeal } from '../services/firestoreService'
import toast from 'react-hot-toast'

export const FeedbackContext = createContext()

export const FeedbackProvider = ({ children }) => {
  const [feedback, setFeedback] = useState({})

  const submitMealFeedback = async (mealId, rating, comment) => {
    try {
      await submitFeedback(mealId, rating, comment)
      setFeedback(prev => ({ ...prev, [mealId]: { rating, comment } }))
      toast.success('Feedback submitted!')
      return true
    } catch (error) {
      toast.error('Failed to submit feedback')
      return false
    }
  }

  const loadMealFeedback = async (mealId) => {
    try {
      const feedbackData = await getMealFeedback(mealId)
      setFeedback(prev => ({ ...prev, [mealId]: feedbackData }))
      return feedbackData
    } catch (error) {
      console.error('Failed to load feedback')
      return null
    }
  }

  const likeMealItem = async (mealId) => {
    try {
      await likeMeal(mealId)
      toast.success('Liked!')
    } catch (error) {
      toast.error('Failed to like meal')
    }
  }

  const dislikeMealItem = async (mealId) => {
    try {
      await dislikeMeal(mealId)
      toast.success('Disliked!')
    } catch (error) {
      toast.error('Failed to dislike meal')
    }
  }

  const value = {
    feedback,
    submitMealFeedback,
    loadMealFeedback,
    likeMealItem,
    dislikeMealItem
  }

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  )
}