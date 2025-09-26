import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, LogIn, User, Sparkles } from "lucide-react";

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Navigation items for non-logged-in users
  const navItems = [
    {
      path: "/home",
      icon: Home,
      label: "Home",
      color: "text-green-600",
      hoverColor: "group-hover:text-green-600",
      bgColor: "bg-green-50",
      theme: "green",
    },
  ];

  const handleSkipForNow = () => {
    navigate("/home");
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-xl font-bold transition-all duration-300 hover:opacity-80"
          >
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="MenuPick"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="relative inline-block">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
                MenuPick
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Navigation Items */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 group relative ${
                  location.pathname === item.path ? item.bgColor : ""
                }`}
                title={item.label}
              >
                <div className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110">
                  <item.icon
                    size={20}
                    className={`${
                      location.pathname === item.path
                        ? item.color
                        : "text-gray-700"
                    } ${item.hoverColor} transition-colors duration-300`}
                  />
                </div>

                {/* Hover Tooltip */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <div
                    className={`px-3 py-2 rounded-lg shadow-lg ${item.bgColor} border border-${item.theme}-200`}
                  >
                    <span
                      className={`text-sm font-medium ${item.color} whitespace-nowrap`}
                    >
                      {item.label}
                    </span>
                    <div
                      className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${item.bgColor} border-l border-t border-${item.theme}-200`}
                    ></div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Spacing between nav items and profile */}
            <div className="w-4"></div>

            {/* Profile dropdown for guest user */}
            <div className="relative" ref={profileRef}>
              <button
                onMouseEnter={() => setIsProfileOpen(true)}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 group-hover:scale-110">
                  <User
                    size={18}
                    className="text-gray-600 group-hover:text-purple-600 transition-colors"
                  />
                </div>

                {/* Hover Tooltip */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <div className="px-3 py-2 rounded-lg shadow-lg bg-purple-50 border border-purple-200">
                    <span className="text-sm font-medium text-purple-600 whitespace-nowrap">
                      Guest Menu
                    </span>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-purple-50 border-l border-t border-purple-200"></div>
                  </div>
                </div>
              </button>

              {/* Guest Profile Dropdown */}
              <div
                className={`absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl py-4 z-50 border border-white/50 transition-all duration-300 transform origin-top-right ${
                  isProfileOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                {/* Header with gradient */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-t-2xl text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border-2 border-white/50">
                      <User size={24} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg truncate">
                        Welcome Guest!
                      </p>
                      <p className="text-white/80 text-sm truncate">
                        Sign in to access all features
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/auth"
                    className="flex items-center px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 group"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <LogIn
                      size={18}
                      className="mr-3 text-blue-500 group-hover:scale-110 transition-transform"
                    />
                    <span>Sign In / Register</span>
                    <Sparkles
                      size={14}
                      className="ml-auto text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>

                  <button
                    onClick={handleSkipForNow}
                    className="flex items-center w-full text-left px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-300 group"
                  >
                    <Home
                      size={18}
                      className="mr-3 text-green-500 group-hover:scale-110 transition-transform"
                    />
                    <span>Continue as Guest</span>
                    <Sparkles
                      size={14}
                      className="ml-auto text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>

                  <div className="mx-6 my-2 border-t border-gray-200"></div>

                  <div className="px-6 py-2">
                    <p className="text-xs text-gray-500 text-center">
                      Explore basic features without signing in
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacing between profile and login button */}
            <div className="w-6"></div>

            {/* Login Button */}
            <Link
              to="/auth"
              className="bg-gradient-to-r from-green-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 shadow-md flex items-center group"
            >
              <LogIn
                size={18}
                className="mr-2 group-hover:scale-110 transition-transform"
              />
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-96 pb-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-1 pt-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? item.bgColor
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon
                  size={20}
                  className={`mr-3 ${
                    location.pathname === item.path
                      ? item.color
                      : "text-gray-600"
                  }`}
                />
                {item.label}
              </Link>
            ))}

            <hr className="my-2 border-gray-200" />

            {/* Mobile Guest Options */}
            <Link
              to="/auth"
              className="flex items-center text-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-blue-50"
              onClick={() => setIsOpen(false)}
            >
              <LogIn size={20} className="mr-3 text-blue-600" />
              Sign In / Register
            </Link>

            <button
              onClick={() => {
                handleSkipForNow();
                setIsOpen(false);
              }}
              className="flex items-center text-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-green-50 text-left"
            >
              <Home size={20} className="mr-3 text-green-600" />
              Continue as Guest
            </button>

            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 text-center">
                Explore basic features without signing in
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
