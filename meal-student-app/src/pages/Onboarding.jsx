import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Utensils, 
  Heart, 
  Star, 
  Calendar, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  ChevronLeft,
  X
} from 'lucide-react'

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const steps = [
    {
      icon: <Utensils size={isMobile ? 32 : 48} className="text-green-500" />,
      title: "Welcome to MealPicker",
      description: "Discover, choose, and enjoy your campus meals like never before.",
      gradient: "from-green-400 to-green-300",
      emoji: "🍽️"
    },
    {
      icon: <Heart size={isMobile ? 32 : 48} className="text-red-500" />,
      title: "Personalized Preferences",
      description: "Select your favorite meals each month and help us serve you better.",
      gradient: "from-red-400 to-red-300",
      emoji: "❤️"
    },
    {
      icon: <Star size={isMobile ? 32 : 48} className="text-purple-500" />,
      title: "Rate & Review",
      description: "Share feedback on meals to improve the dining experience for everyone.",
      gradient: "from-purple-400 to-purple-300",
      emoji: "⭐"
    },
    {
      icon: <Calendar size={isMobile ? 32 : 48} className="text-green-600" />,
      title: "Plan Ahead",
      description: "View upcoming menus and never miss your favorite meals.",
      gradient: "from-green-400 to-purple-400",
      emoji: "📅"
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      if (onComplete) onComplete()
      navigate('/auth')
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const handleSkip = () => {
    if (onComplete) onComplete()
    navigate('/auth')
  }

  // Swipe handling for mobile
  useEffect(() => {
    if (!isMobile) return

    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    }

    const handleSwipe = () => {
      const diff = touchStartX - touchEndX
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0 && currentStep < steps.length - 1) {
          handleNext()
        } else if (diff < 0 && currentStep > 0) {
          handlePrev()
        }
      }
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentStep, isMobile])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-purple-50 to-red-50 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float md:w-64 md:h-64"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000 md:w-64 md:h-64"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-4000 md:w-64 md:h-64"></div>
      </div>

      {/* Close Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-lg md:top-8 md:right-8"
      >
        <X size={isMobile ? 18 : 20} className="text-gray-600" />
      </button>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-lg'}`}>
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Progress Header */}
            <div className="p-6 border-b border-white/30">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrev}
                  className={`p-2 rounded-full transition-all ${
                    currentStep > 0 
                      ? 'text-gray-600 hover:bg-gray-100 hover:scale-110' 
                      : 'invisible'
                  }`}
                >
                  <ChevronLeft size={isMobile ? 18 : 20} />
                </button>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                    <img src="/logo.png" alt="MealPicker" className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
                    MealPicker
                  </span>
                </div>
                
                <div className="w-6"></div> {/* Spacer for balance */}
              </div>

              {/* Progress Bar */}
              <div className="flex justify-center space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index === currentStep 
                        ? `bg-gradient-to-r ${steps[index].gradient} ${isMobile ? 'w-6' : 'w-8'}` 
                        : index < currentStep 
                          ? 'bg-green-300 w-2' 
                          : 'bg-gray-200 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className={`${isMobile ? 'p-6' : 'p-8'}`}>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-2xl bg-gradient-to-br ${steps[currentStep].gradient} shadow-lg transition-transform duration-300 hover:scale-105`}>
                  {steps[currentStep].icon}
                </div>
              </div>
              
              {/* Text Content */}
              <div className="text-center mb-6">
                <h2 className={`font-bold text-gray-900 mb-3 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  {steps[currentStep].title}
                </h2>
                <p className={`text-gray-600 leading-relaxed ${isMobile ? 'text-base' : 'text-lg'}`}>
                  {steps[currentStep].description}
                </p>
              </div>

              {/* Visual Indicator */}
              <div className="flex justify-center mb-6">
                <div className={`${isMobile ? 'w-20' : 'w-32'} h-1 rounded-full bg-gradient-to-r ${steps[currentStep].gradient} shadow transition-all duration-500`}></div>
              </div>

              {/* Illustration */}
              <div className="flex justify-center mb-6">
                <div className={`${isMobile ? 'w-full h-32' : 'w-full h-48'} rounded-2xl bg-gradient-to-br ${steps[currentStep].gradient} flex items-center justify-center shadow-lg transition-all duration-500`}>
                  <div className="text-white opacity-90" style={{ fontSize: isMobile ? '3rem' : '4rem' }}>
                    {steps[currentStep].emoji}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleNext}
                  className={`w-full py-4 text-white font-semibold transition-all duration-300 hover:shadow-xl active:scale-95 rounded-2xl shadow-lg bg-gradient-to-r ${steps[currentStep].gradient} flex items-center justify-center`}
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Sparkles size={isMobile ? 16 : 20} className="mr-2" />
                      Start Your Journey
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight size={isMobile ? 16 : 20} className="ml-2" />
                    </>
                  )}
                </button>
                
                {currentStep < steps.length - 1 && (
                  <button
                    onClick={handleSkip}
                    className="w-full text-gray-500 hover:text-gray-700 transition-colors py-3 font-medium text-sm"
                  >
                    Skip onboarding
                  </button>
                )}
              </div>

              {/* Step Indicator for Mobile */}
              {isMobile && (
                <div className="flex justify-center mt-4">
                  <span className="text-xs text-gray-500">
                    {currentStep + 1} of {steps.length}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-green-50/80 via-purple-50/80 to-red-50/80 p-4 border-t border-white/30">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-xs md:text-sm">Trusted by thousands of students worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      {isMobile && currentStep < steps.length - 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-black/50 text-white text-xs py-1 px-3 rounded-full backdrop-blur-sm">
            ← Swipe to continue →
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}