import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Utensils, ChefHat } from 'lucide-react'

const Splash = () => {
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      
      if (currentUser) {
        navigate('/')
      } else {
        navigate('/onboarding')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [currentUser, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="text-center text-white">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Utensils size={48} className="text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <ChefHat size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">MealPicker</h1>
        <p className="text-lg opacity-90 mb-8">Your personalized campus dining experience</p>
        
        {loading && (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
        
        {!loading && (
          <div className="animate-pulse">
            <p className="text-sm opacity-80">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Splash