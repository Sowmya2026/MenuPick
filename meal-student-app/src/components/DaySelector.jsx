import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const DaySelector = ({ days, selectedDay, onSelect, messType = 'veg', hideLabel = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const { theme } = useTheme();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get current day
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    setCurrentDay(today);
    if (days.includes(today)) {
      onSelect(today);
    }
  }, []);

  // Get color based on mess type from theme
  const getMessColor = () => {
    switch (messType) {
      case 'veg':
        return theme.colors.veg.primary;
      case 'non-veg':
        return theme.colors.nonVeg.primary;
      case 'special':
        return theme.colors.special.primary;
      default:
        return theme.colors.primary;
    }
  };

  const messColor = getMessColor();

  // Get day abbreviation
  const getDayAbbreviation = (day) => {
    const abbr = {
      Monday: 'M',
      Tuesday: 'T',
      Wednesday: 'W',
      Thursday: 'Th',
      Friday: 'F',
      Saturday: 'S',
      Sunday: 'Su',
    };
    return isMobile ? (abbr[day] || day.substring(0, 1)) : day.substring(0, 3);
  };

  return (
    <div className="mb-4">
      {!hideLabel && (
        <h3 className="text-sm font-semibold mb-3 px-1" style={{ color: theme.colors.textSecondary }}>
          Select Day
        </h3>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {days.map((day) => {
          const isToday = day === currentDay;
          const isSelected = selectedDay === day;
          const displayText = getDayAbbreviation(day);

          return (
            <motion.button
              key={day}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(day)}
              className="flex flex-col items-center justify-center min-w-[60px] px-3 py-2.5 rounded-xl font-medium transition-all relative"
              style={{
                background: isSelected
                  ? messColor
                  : isToday
                    ? messColor + '20'
                    : theme.colors.backgroundSecondary,
                color: isSelected
                  ? 'white'
                  : isToday
                    ? messColor
                    : theme.colors.text,
                border: `2px solid ${isSelected || isToday ? messColor : theme.colors.border}`,
              }}
              title={day}
            >
              <span className="text-sm font-bold">{displayText}</span>
              {isToday && !isSelected && (
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1"
                  style={{ background: messColor }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default DaySelector;