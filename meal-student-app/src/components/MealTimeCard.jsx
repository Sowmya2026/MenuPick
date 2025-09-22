import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Utensils, Coffee, Sun, Moon, ChefHat } from 'lucide-react';

const MealTimeCard = ({ 
  mealTime, 
  timing, 
  items 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Get meal-specific styling and icons
  const getMealStyles = () => {
    switch(mealTime) {
      case 'breakfast':
        return {
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          accentColor: 'text-amber-600',
          icon: <Coffee size={22} className="text-amber-600" />,
          dotColor: 'bg-amber-400',
          shadow: 'shadow-amber-100'
        };
      case 'lunch':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          accentColor: 'text-green-600',
          icon: <Sun size={22} className="text-green-600" />,
          dotColor: 'bg-green-400',
          shadow: 'shadow-green-100'
        };
      case 'dinner':
        return {
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600',
          icon: <Moon size={22} className="text-purple-600" />,
          dotColor: 'bg-purple-400',
          shadow: 'shadow-purple-100'
        };
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          accentColor: 'text-blue-600',
          icon: <Utensils size={22} className="text-blue-600" />,
          dotColor: 'bg-blue-400',
          shadow: 'shadow-blue-100'
        };
    }
  };

  const styles = getMealStyles();

  return (
    <div 
      className={`rounded-2xl p-5 transition-all duration-300 border-2 ${styles.borderColor} bg-white hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl mr-4 ${styles.bgColor}`}>
            {styles.icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 capitalize text-lg">{mealTime}</h3>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Clock size={11} className="mr-1.5" />
              <span>{timing}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={toggleExpand}
          className={`p-2 rounded-full transition-colors ${styles.accentColor} hover:bg-white`}
          aria-label={isExpanded ? "Collapse meals" : "Expand meals"}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
          <div className="flex items-center mb-3">
            <ChefHat size={16} className="text-gray-400 mr-2" />
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Today's Menu</h4>
          </div>
          
          {items.length > 0 ? (
            <ul className="space-y-3">
              {items.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start animate-fadeIn transition-all duration-300 hover:translate-x-1"
                >
                  <div className={`w-2.5 h-2.5 rounded-full mt-2 mr-3 flex-shrink-0 ${styles.dotColor}`}></div>
                  <span className="text-gray-800 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-300 mb-2">
                <Utensils size={40} className="mx-auto" />
              </div>
              <p className="text-gray-400">No items available for this meal time</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealTimeCard;