import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Utensils, 
  Heart, 
  Star, 
  Calendar, 
  ArrowRight,
  CheckCircle 
} from 'lucide-react'

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const steps = [
    {
      icon: <Utensils size={48} className="text-blue-600" />,
      title: "Welcome to MealPicker",
      description: "Discover, choose, and enjoy your campus meals like never before.",
      image: "/api/placeholder/300/200"
    },
    {
      icon: <Heart size={48} className="text-red-500" />,
      title: "Personalized Preferences",
      description: "Select your favorite meals each month and help us serve you better.",
      image: "/api/placeholder/300/200"
    },
    {
      icon: <Star size={48} className="text-yellow-500" />,
      title: "Rate & Review",
      description: "Share feedback on meals to improve the dining experience for everyone.",
      image: "/api/placeholder/300/200"
    },
    {
      icon: <Calendar size={48} className="text-green-500" />,
      title: "Plan Ahead",
      description: "View upcoming menus and never miss your favorite meals.",
      image: "/api/placeholder/300/200"
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      navigate('/auth')
    }
  }

  const handleSkip = () => {
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            {steps[currentStep].icon}
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <img 
              src={steps[currentStep].image} 
              alt={steps[currentStep].title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          <div className="flex justify-center space-x-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep ? 'bg-blue-600 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleNext}
              className="w-full btn-primary flex items-center justify-center"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight size={20} className="ml-2" />
            </button>
            
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="w-full text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip onboarding
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <CheckCircle size={16} />
            <span>Trusted by thousands of students</span>
          </div>
        </div>
      </div>
    </div>
  )
}