import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const DaySelector = ({ days, selectedDay, onSelect, messType = 'veg' }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentDay, setCurrentDay] = useState('');

  // Check screen size and set up resize listener
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get the current day of the week on component mount
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    setCurrentDay(today);
    
    // Always select the current day on component mount
    if (days.includes(today)) {
      onSelect(today);
    }
  }, []);

  // Get color classes based on mess type - matching MealTimeCard colors
  const getColorClasses = () => {
    switch (messType) {
      case 'veg':
        return {
          selected: 'from-green-500 to-green-700',
          today: 'bg-green-100 text-green-900 border-green-300 shadow-md', // Enhanced today style
          todayDot: 'bg-green-500',
          default: 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'
        };
      case 'non-veg':
        return {
          selected: 'from-red-500 to-red-700',
          today: 'bg-red-100 text-red-900 border-red-300 shadow-md',
          todayDot: 'bg-red-500',
          default: 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'
        };
      case 'special':
        return {
          selected: 'from-purple-500 to-purple-700',
          today: 'bg-purple-100 text-purple-900 border-purple-300 shadow-md',
          todayDot: 'bg-purple-500',
          default: 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100'
        };
      default:
        return {
          selected: 'from-green-500 to-green-700',
          today: 'bg-green-100 text-green-900 border-green-300 shadow-md',
          todayDot: 'bg-green-500',
          default: 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'
        };
    }
  };

  const colors = getColorClasses();

  // Function to get day abbreviation
  const getDayAbbreviation = (day) => {
    switch(day.toLowerCase()) {
      case 'monday': return 'M';
      case 'tuesday': return 'T';
      case 'wednesday': return 'W';
      case 'thursday': return 'Th';
      case 'friday': return 'F';
      case 'saturday': return 'S';
      case 'sunday': return 'Su';
      default: return day.substring(0, 2);
    }
  };

  return (
    <div className="mb-6 md:mb-8">
      
      <div className="flex justify-between md:justify-start md:gap-3">
        {days.map(day => {
          const isToday = day === currentDay;
          const isSelected = selectedDay === day;
          const displayText = isMobile ? getDayAbbreviation(day) : day.substring(0, 3);
          
          return (
            <div key={day} className="relative flex flex-col items-center">
              <button
                onClick={() => onSelect(day)}
                className={`
                  flex items-center justify-center 
                  rounded-3xl transition-all duration-300 
                  font-medium relative border-2
                  ${isSelected
                    ? `bg-gradient-to-r ${colors.selected} text-white shadow-lg border-transparent transform scale-105`
                    : isToday
                    ? `${colors.today} border-2 font-semibold` // Enhanced today styling
                    : `${colors.default}`
                  }
                  ${isMobile 
                    ? 'h-10 w-10 text-sm' 
                    : 'h-12 w-12 text-base'
                  }
                  hover:scale-105 active:scale-95
                `}
                title={isToday ? `${day} (Today)` : day}
              >
                {displayText}
                
                {/* Today indicator dot - show only when not selected */}
                {isToday && !isSelected && (
                  <div className={`absolute -top-1 -right-1 w-3 h-3 ${colors.todayDot} rounded-full border-2 border-white`}></div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DaySelector;