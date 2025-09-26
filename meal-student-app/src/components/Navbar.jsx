import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Home,
  Utensils,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const LoggedInNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/home");
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Failed to log out");
    }
  };

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

  // Navigation items for logged-in users
  const navItems = [
    {
      path: "/",
      icon: Home,
      label: "Home",
      color: "text-green-600",
      hoverColor: "group-hover:text-green-600",
      bgColor: "bg-green-50",
      theme: "green",
    },
    {
      path: "/selection",
      icon: Utensils,
      label: "Meal Selection",
      color: "text-red-600",
      hoverColor: "group-hover:text-red-600",
      bgColor: "bg-red-50",
      theme: "red",
    },
    {
      path: "/feedback",
      icon: MessageSquare,
      label: "Feedback",
      color: "text-purple-600",
      hoverColor: "group-hover:text-purple-600",
      bgColor: "bg-purple-50",
      theme: "purple",
    },
  ];

  return (
    <nav className="bg-white relative ">
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
            <div className="w-6"></div>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onMouseEnter={() => setIsProfileOpen(true)}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center transition-all duration-300 group"
              >
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || "User"}
                    className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-green-400 transition-all duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-gray-200 hover:border-green-400 transition-all duration-300 group-hover:scale-110">
                    <User
                      size={18}
                      className="text-gray-600 group-hover:text-green-600 transition-colors"
                    />
                  </div>
                )}

                {/* Hover Tooltip */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <div className="px-3 py-2 rounded-lg shadow-lg bg-green-50 border border-green-200">
                    <span className="text-sm font-medium text-green-600 whitespace-nowrap">
                      Profile
                    </span>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-green-50 border-l border-t border-green-200"></div>
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              <div
                className={`absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl py-4 z-50 border border-white/50 transition-all duration-300 transform origin-top-right ${
                  isProfileOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                {/* Header with user info */}
                <div className="px-6 py-4 bg-gradient-to-r from-green-200 via-purple-200 to-red-200 rounded-t-2xl text-white">
                  <div className="flex items-center space-x-3">
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || "User"}
                        className="w-12 h-12 rounded-xl border-2 border-white/50"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border-2 border-white/50">
                        <User size={24} className="text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg truncate">
                        {currentUser?.displayName || "Welcome Back!"}
                      </p>
                      <p className="text-white/80 text-sm truncate">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-300 group"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User
                      size={18}
                      className="mr-3 text-green-500 group-hover:scale-110 transition-transform"
                    />
                    <span>My Profile</span>
                    <Sparkles
                      size={14}
                      className="ml-auto text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all duration-300 group"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings
                      size={18}
                      className="mr-3 text-purple-500 group-hover:scale-110 transition-transform"
                    />
                    <span>Settings</span>
                    <Sparkles
                      size={14}
                      className="ml-auto text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>

                  <div className="mx-6 my-2 border-t border-gray-200"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 group"
                  >
                    <LogOut
                      size={18}
                      className="mr-3 text-red-500 group-hover:scale-110 transition-transform"
                    />
                    <span>Logout</span>
                    <Sparkles
                      size={14}
                      className="ml-auto text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </div>
              </div>
            </div>
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

            {/* Mobile Profile Section */}
            <div className="px-3 py-2 flex items-center space-x-3">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm">
                  {currentUser?.displayName || "User"}
                </p>
                <p className="text-gray-500 truncate text-xs">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <Link
              to="/profile"
              className="flex items-center text-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <User size={20} className="mr-3 text-green-600" />
              My Profile
            </Link>

            <Link
              to="/settings"
              className="flex items-center text-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-purple-50"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={20} className="mr-3 text-purple-600" />
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LoggedInNavbar;
