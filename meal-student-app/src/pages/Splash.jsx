import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles } from 'lucide-react'

const Splash = () => {
  const [loading, setLoading] = useState(true)
  const [displayText, setDisplayText] = useState('')
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
    }, 2500)

    // Typing animation
    const text = "Your personalized campus dining experience"
    let index = 0
    const typingInterval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index))
        index++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => {
      clearTimeout(timer)
      clearInterval(typingInterval)
    }
  }, [currentUser, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-purple-50 to-red-100 relative overflow-hidden p-4">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float md:w-80 md:h-80"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-2000 md:w-80 md:h-80"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-4000 md:w-80 md:h-80"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-purple-500 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="text-center text-gray-800 relative z-10 max-w-md w-full">
        {/* Logo Container */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-white/80 rounded-3xl flex items-center justify-center backdrop-blur-lg shadow-2xl border border-white/50 md:w-32 md:h-32">
              <img 
                src="/logo.png" 
                alt="MealPicker Logo" 
                className="w-12 h-12 object-contain md:w-16 md:h-16"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white md:w-12 md:h-12">
              <Sparkles size={16} className="text-white md:w-20" />
            </div>
          </div>
        </div>
        
        {/* Animated Title */}
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 via-purple-600 to-red-600 bg-clip-text text-transparent md:text-5xl">
          MealPicker
        </h1>
        
        {/* Typing Animation */}
        <p className="text-lg text-gray-600 mb-8 font-medium min-h-[3rem] md:text-xl">
          {displayText}
          <span className="animate-pulse">|</span>
        </p>
        
        {/* Enhanced Loading Animation */}
        {loading && (
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-green-200 rounded-full animate-spin md:w-16 md:h-16"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin md:w-16 md:h-16"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-r-red-500 rounded-full animate-spin animation-reverse md:w-16 md:h-16"></div>
            </div>
          </div>
        )}
        
        {/* Redirect Message */}
        {!loading && (
          <div className="animate-fade-in">
            <p className="text-sm text-gray-500 font-medium bg-white/50 backdrop-blur-sm rounded-full py-2 px-4 inline-block">
              🚀 Redirecting to your dining journey...
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-reverse {
          animation-direction: reverse;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Splash