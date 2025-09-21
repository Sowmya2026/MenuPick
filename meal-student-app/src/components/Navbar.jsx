import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Bell, 
  Settings, 
  Home, 
  Utensils, 
  MessageSquare,
  ChefHat
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Failed to log out');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md relative border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center text-xl font-bold text-gray-800 transition-all duration-300 hover:opacity-80"
          >
            <ChefHat size={26} className="mr-2 text-blue-600" />
            <span>MealPicker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="flex flex-col items-center p-3 text-gray-600 rounded-lg transition-all duration-300 hover:bg-gray-50 group relative"
              title="Home"
            >
              <Home size={20} className="text-blue-600" />
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-5 bg-gray-800 text-white px-2 py-1 rounded-md">
                Home
              </span>
            </Link>
            
            <Link 
              to="/selection" 
              className="flex flex-col items-center p-3 text-gray-600 rounded-lg transition-all duration-300 hover:bg-gray-50 group relative"
              title="Meal Selection"
            >
              <Utensils size={20} className="text-orange-500" />
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-5 bg-gray-800 text-white px-2 py-1 rounded-md">
                Meals
              </span>
            </Link>
            
            <Link 
              to="/feedback" 
              className="flex flex-col items-center p-3 text-gray-600 rounded-lg transition-all duration-300 hover:bg-gray-50 group relative"
              title="Feedback"
            >
              <MessageSquare size={20} className="text-green-600" />
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-5 bg-gray-800 text-white px-2 py-1 rounded-md">
                Feedback
              </span>
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-1 ml-2">
                <button 
                  className="p-3 text-gray-600 rounded-full transition-all duration-300 hover:bg-gray-50 relative group"
                  title="Notifications"
                >
                  <Bell size={20} className="text-purple-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    3
                  </span>
                  <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-7 bg-gray-800 text-white px-2 py-1 rounded-md">
                    Notifications
                  </span>
                </button>
                
                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button 
                    onMouseEnter={() => setIsProfileOpen(true)}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center transition-all duration-300 ml-2 group"
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User'}
                        className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-blue-400 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 group">
                        <User size={18} className="text-gray-600" />
                      </div>
                    )}
                    <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-7 bg-gray-800 text-white px-2 py-1 rounded-md">
                      Profile
                    </span>
                  </button>

                  {/* Dropdown menu with animation */}
                  <div 
                    className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 transition-all duration-300 transform origin-top-right ${isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {currentUser.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-300"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} className="mr-3 text-blue-600" />
                      Profile
                    </Link>
                    
                    <Link 
                      to="/settings" 
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-300"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} className="mr-3 text-blue-600" />
                      Settings
                    </Link>
                    
                    <hr className="my-1 border-gray-200" />
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-300"
                    >
                      <LogOut size={16} className="mr-3 text-red-600" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
              >
                <User size={18} className="mr-2" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation with animation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
          <div className="flex flex-col space-y-1 pt-3">
            <Link 
              to="/" 
              className="flex items-center text-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <Home size={20} className="mr-3 text-blue-600" />
              Home
            </Link>
            
            <Link 
              to="/selection" 
              className="flex items-center text-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <Utensils size={20} className="mr-3 text-orange-500" />
              Meal Selection
            </Link>
            
            <Link 
              to="/feedback" 
              className="flex items-center text-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <MessageSquare size={20} className="mr-3 text-green-600" />
              Feedback
            </Link>
            
            {currentUser ? (
              <>
                <hr className="my-2 border-gray-200" />
                
                <div className="flex items-center text-gray-700 p-3 rounded-lg">
                  <Bell size={20} className="mr-3 text-purple-600" />
                  Notifications
                  <span className="ml-auto w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    3
                  </span>
                </div>
                
                <Link 
                  to="/profile" 
                  className="flex items-center text-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-6 h-6 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <User size={14} className="text-gray-600" />
                    </div>
                  )}
                  Profile
                </Link>
                
                <Link 
                  to="/settings" 
                  className="flex items-center text-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings size={20} className="mr-3 text-blue-600" />
                  Settings
                </Link>
                
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center text-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-red-50 text-left"
                >
                  <LogOut size={20} className="mr-3 text-red-600" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center hover:bg-blue-700 transition-all duration-300 mt-2 flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} className="mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;