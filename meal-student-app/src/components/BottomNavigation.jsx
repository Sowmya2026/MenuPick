import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { selectedMess } = useMenu();

  const getColorTheme = () => {
    const colors = {
      'veg': { active: 'text-green-600', bg: 'bg-green-500' },
      'non-veg': { active: 'text-red-600', bg: 'bg-red-500' },
      'special': { active: 'text-purple-600', bg: 'bg-purple-500' }
    };
    return colors[selectedMess] || colors.veg;
  };

  const theme = getColorTheme();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/selection', icon: Utensils, label: 'Meals' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t border-gray-100/50 md:hidden z-50 safe-area-bottom py-1 shadow-sm">
      <div className="flex justify-around items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-1.5 rounded-xl transition-all duration-200 relative group min-w-[55px] ${
                isActive ? 'transform -translate-y-0.5' : ''
              }`}
            >
              {/* Super Compact Icon */}
              <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? `${theme.bg} text-white shadow-xs` 
                  : 'text-gray-400 group-hover:text-gray-600'
              }`}>
                <Icon size={14} />
              </div>
              
              {/* Micro Label */}
              <span className={`text-[9px] font-semibold mt-0.5 transition-colors ${
                isActive ? theme.active : 'text-gray-400'
              }`}>
                {item.label}
              </span>
              
              {/* Tiny Active Indicator */}
              {isActive && (
                <div className={`absolute -bottom-0.5 w-0.5 h-0.5 rounded-full ${theme.bg} animate-pulse`} />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;