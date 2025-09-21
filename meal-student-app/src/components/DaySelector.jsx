import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const DaySelector = ({ days, selectedDay, onSelect }) => {
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
                  rounded-full transition-all duration-300 
                  font-medium relative
                  ${isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : isToday
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                  ${isMobile 
                    ? 'h-10 w-10 text-sm' 
                    : 'h-12 w-12 text-base'
                  }
                `}
                title={isToday ? `${day} (Today)` : day}
              >
                {displayText}
              </button>
              
              {/* Today indicator dot */}
              {isToday && !isSelected && (
                <div className="absolute -bottom-1 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DaySelector;

