import { useAuth } from '../context/AuthContext'
import { useMenu } from '../context/MenuContext'
import DaySelector from '../components/DaySelector'
import MealTimeCard from '../components/MealTimeCard'
import { Leaf, Beef, Star, Calendar, Utensils } from 'lucide-react'
import { useEffect, useState } from 'react'

const Home = () => {
  const { currentUser } = useAuth()
  const { 
    selectedMess, 
    setSelectedMess, 
    selectedDay,
    setSelectedDay,
    selectedMealTime,
    setSelectedMealTime,
    getMenuItems,
    getMessColor,
    getTimings,
    days
  } = useMenu()

  const [currentDate, setCurrentDate] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Set default mess type based on user preference
  useEffect(() => {
    if (currentUser?.messPreference) {
      setSelectedMess(currentUser.messPreference);
    }
    
    // Set current date in a formatted way
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    setCurrentDate(formattedDate);
  }, [currentUser, setSelectedMess]);

  // Mess type options with icons
  const messTypes = [
    { 
      id: 'veg', 
      name: 'Vegetarian', 
      icon: <Leaf size={22} className="text-green-600" />,
      color: 'green'
    },
    { 
      id: 'non-veg', 
      name: 'Non-Veg', 
      icon: <Beef size={22} className="text-red-600" />,
      color: 'red'
    },
    { 
      id: 'special', 
      name: 'Special', 
      icon: <Star size={22} className="text-yellow-600" />,
      color: 'yellow'
    }
  ]

  // Get current mess color
  const currentMessColor = getMessColor(selectedMess)
  const currentTimings = getTimings(selectedMess)

  // Get selected mess details
  const selectedMessDetails = messTypes.find(mess => mess.id === selectedMess) || messTypes[0]

  // Get color class based on mess type
  const getColorClass = (messId) => {
    switch(messId) {
      case 'veg': return 'text-green-600'
      case 'non-veg': return 'text-red-600'
      case 'special': return 'text-yellow-600'
      default: return 'text-gray-800'
    }
  }

  // Motivational quotes for students
  const motivationalQuotes = [
    "Nourish your body, fuel your mind, conquer your day.",
    "Good food is the foundation of genuine happiness.",
    "Eating well is a form of self-respect.",
    "Your diet is a bank account. Good food choices are good investments.",
    "Food is not just energy, it's an experience. Enjoy every bite."
  ]

  // Select a random quote
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

  return (
    <div className="bg-white space-y-6 px-4 py-4 md:space-y-8 md:px-0 md:py-6">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-900 to-purple-600 bg-clip-text text-transparent font-serif md:text-4xl">Campus Dining</h1>
        <p className="text-base text-gray-700 italic font-light mt-2 md:text-lg md:mt-3">"{randomQuote}"</p>
        <div className="flex items-center justify-center mt-3 text-gray-600">
          <Calendar size={16} className="mr-2" />
          <p className="text-sm">{currentDate}</p>
        </div>
      </div>

      {/* Mess Type Selector - Icon only with hover dropdown */}
      <div className="flex items-center justify-center">
        <div 
          className="relative inline-flex items-center"
          onMouseEnter={() => {
            setIsHovered(true)
            setIsOpen(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
            setIsOpen(false)
          }}
        >
          {/* Icon container - always visible */}
          <div className="p-3 bg-white border border-gray-300 rounded-lg cursor-pointer shadow-sm flex items-center justify-center">
            {selectedMessDetails.icon}
          </div>
          
          {/* Dropdown that appears on hover */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
              {messTypes.map((mess) => (
                <div
                  key={mess.id}
                  className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedMess === mess.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => {
                    setSelectedMess(mess.id)
                    setIsOpen(false)
                    setIsHovered(false)
                  }}
                >
                  <div className="mr-3">
                    {mess.icon}
                  </div>
                  <span className="text-gray-800">{mess.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Menu title with colored text */}
        <h2 className={`ml-3 text-xl font-semibold font-serif md:text-2xl ${getColorClass(selectedMess)}`}>
          {selectedMessDetails.name} Menu
        </h2>
      </div>

      {selectedMess && (
        <div className="mt-6 max-w-6xl mx-auto md:mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
            <div className="mt-2 md:mt-0">
              <DaySelector 
                days={days} 
                selectedDay={selectedDay} 
                onSelect={setSelectedDay}
                hideLabel={true}
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {Object.entries(currentTimings).map(([mealTime, timing]) => (
              <MealTimeCard
                key={mealTime}
                mealTime={mealTime}
                timing={timing}
                isSelected={selectedMealTime === mealTime}
                onSelect={setSelectedMealTime}
                items={getMenuItems(selectedMess, selectedDay, mealTime)}
                color={currentMessColor}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default Home