import { Clock, ChevronDown, ChevronUp, Utensils, Coffee, Sun, Moon, ChefHat } from 'lucide-react';
import { useState } from 'react';

const MealTimeCard = ({ 
  mealTime, 
  timing, 
  items,
  messType = 'veg',
  isExpanded = false,
  onToggleExpand
}) => {
  const [isTapping, setIsTapping] = useState(false);

  // Get color classes based on mess type
  const getMessColorClasses = () => {
    switch (messType) {
      case 'veg':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          accentColor: 'text-green-600',
          dotColor: 'bg-green-400',
          shadow: 'shadow-green-100',
          hoverBg: 'hover:bg-green-50',
          tapColor: 'bg-green-100',
          activeShadow: 'shadow-green-200'
        };
      case 'non-veg':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          accentColor: 'text-red-600',
          dotColor: 'bg-red-400',
          shadow: 'shadow-red-100',
          hoverBg: 'hover:bg-red-50',
          tapColor: 'bg-red-100',
          activeShadow: 'shadow-red-200'
        };
      case 'special':
        return {
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600',
          dotColor: 'bg-purple-400',
          shadow: 'shadow-purple-100',
          hoverBg: 'hover:bg-purple-50',
          tapColor: 'bg-purple-100',
          activeShadow: 'shadow-purple-200'
        };
      default:
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          accentColor: 'text-green-600',
          dotColor: 'bg-green-400',
          shadow: 'shadow-green-100',
          hoverBg: 'hover:bg-green-50',
          tapColor: 'bg-green-100',
          activeShadow: 'shadow-green-200'
        };
    }
  };

  const messColors = getMessColorClasses();

  // Get meal-specific icons (using mess type colors)
  const getMealIcon = () => {
    switch(mealTime) {
      case 'breakfast':
        return <Coffee size={20} className={messColors.accentColor} />;
      case 'lunch':
        return <Sun size={20} className={messColors.accentColor} />;
      case 'dinner':
        return <Moon size={20} className={messColors.accentColor} />;
      default:
        return <Utensils size={20} className={messColors.accentColor} />;
    }
  };

  const mealIcon = getMealIcon();

  // Touch event handlers for mobile
  const handleTouchStart = () => {
    setIsTapping(true);
  };

  const handleTouchEnd = () => {
    setIsTapping(false);
  };

  const handleTouchMove = () => {
    setIsTapping(false);
  };

  // Handle card click - expand/collapse on desktop, only button click on mobile
  const handleCardClick = (e) => {
    // Prevent triggering on button click (let button handle its own click)
    if (e.target.closest('button')) {
      return;
    }
    
    // On desktop, allow clicking anywhere on card to toggle
    if (window.innerWidth >= 768) {
      onToggleExpand();
    }
  };

  // Handle mobile card tap
  const handleMobileTap = (e) => {
    // Prevent triggering on button click
    if (e.target.closest('button')) {
      return;
    }
    
    // On mobile, allow tapping anywhere on card to toggle
    if (window.innerWidth < 768) {
      onToggleExpand();
    }
  };

  // Handle button click specifically
  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent card click from firing
    onToggleExpand();
  };

  return (
    <div 
      className={`rounded-xl p-6 md:p-4 transition-all duration-300 border-2 ${messColors.borderColor} bg-white hover:shadow-md ${messColors.shadow} mx-5 mt-1 md:mx-0 cursor-pointer md:cursor-default relative overflow-hidden ${
        isTapping ? `${messColors.tapColor} ${messColors.activeShadow} scale-[0.98]` : ''
      }`}
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={(e) => {
        handleTouchEnd();
        handleMobileTap(e);
      }}
      onTouchMove={handleTouchMove}
      onMouseDown={() => window.innerWidth < 768 && setIsTapping(true)}
      onMouseUp={() => window.innerWidth < 768 && setIsTapping(false)}
      onMouseLeave={() => setIsTapping(false)}
    >
      {/* Ripple effect for mobile */}
      {isTapping && (
        <div 
          className={`absolute inset-0 ${messColors.tapColor} transition-opacity duration-200 opacity-50`}
        />
      )}
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${messColors.bgColor} md:p-3 md:rounded-xl md:mr-4`}>
            {mealIcon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 capitalize text-base md:text-lg">
              {mealTime}
            </h3>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Clock size={10} className="mr-1 md:size-3 md:mr-1.5" />
              <span className="text-xs md:text-sm">{timing}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleButtonClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`p-1.5 rounded-full transition-colors ${messColors.accentColor} ${messColors.hoverBg} md:p-2 relative z-20 ${
            isTapping ? 'scale-95' : ''
          }`}
          aria-label={isExpanded ? "Collapse meals" : "Expand meals"}
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 animate-fadeIn md:mt-4 md:pt-4 relative z-10">
          <div className="flex items-center mb-2 md:mb-3">
            <ChefHat size={14} className={`${messColors.accentColor} mr-2 md:size-4`} />
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide md:text-sm">
              Today's Menu
            </h4>
          </div>
          
          {items.length > 0 ? (
            <ul className="space-y-2 md:space-y-3">
              {items.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start animate-fadeIn transition-all duration-300 hover:translate-x-1"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${messColors.dotColor} md:w-2.5 md:h-2.5 md:mt-2 md:mr-3`}></div>
                  <span className="text-sm text-gray-800 font-medium md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-3 md:py-4">
              <div className="text-gray-300 mb-2">
                <Utensils size={32} className="mx-auto md:size-10" />
              </div>
              <p className="text-gray-400 text-sm md:text-base">No items available for this meal time</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealTimeCard;