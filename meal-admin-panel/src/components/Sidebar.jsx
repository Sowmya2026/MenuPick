import { Fragment, useState, useRef, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {
  X,
  Home,
  Utensils,
  MessageSquare,
  BarChart,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  HelpCircle,
  User,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Meal Management", href: "/meals", icon: Utensils },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Feedback", href: "/feedback", icon: MessageSquare },
];

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Initialize sidebar state
  useEffect(() => {
    // Check if we need to set initial collapsed state
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState !== null) {
      setIsCollapsed(savedState === "true");
    } else {
      setIsCollapsed(true);
    }
  }, [setIsCollapsed]);

  // Save sidebar state when it changes
  useEffect(() => {
    if (isCollapsed !== undefined) {
      localStorage.setItem("sidebarCollapsed", isCollapsed);
    }
  }, [isCollapsed]);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Prevent click inside sidebar from closing it
  const handleSidebarClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Mobile sidebar */}
      <Dialog
        as="div"
        className="fixed inset-0 z-40 flex lg:hidden"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />

        <div
          className="relative flex-1 flex flex-col max-w-xs w-full bg-white"
          onClick={handleSidebarClick}
          ref={sidebarRef}
        >
          {/* Close button */}
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center px-4 mb-5">
              <h1 className="text-xl font-bold text-green-900">Meal Admin</h1>
            </div>
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon && <item.icon className="mr-4 h-6 w-6" />}
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Bottom section for mobile */}
          <div className="flex-shrink-0 flex flex-col border-t border-gray-200 p-4 space-y-2">
            <div className="px-2 py-2 text-sm text-gray-500">
              Logged in as: {currentUser?.email}
            </div>
            <a
              href="#"
              className="flex items-center p-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              <HelpCircle className="mr-4 h-6 w-6" />
              Help
            </a>
            <a
              href="#"
              className="flex items-center p-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              <Settings className="mr-4 h-6 w-6" />
              Settings
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md w-full"
            >
              <LogOut className="mr-4 h-6 w-6" />
              Sign out
            </button>
          </div>
        </div>
      </Dialog>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex lg:flex-shrink-0 ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } transition-all duration-300 ease-in-out`}
        ref={sidebarRef}
      >
        <div className="flex flex-col w-full h-full bg-transparent border-r border-gray-200">
          {/* Top section with toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-primary-600">
                Admin Panel
              </h1>
            )}

            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
            >
              <ChevronLeft
                className={`h-5 w-5 ${
                  isCollapsed ? "rotate-180" : ""
                } transition-transform duration-300`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center ${
                    isCollapsed ? "justify-center px-2" : "px-2"
                  } py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {item.icon && (
                  <item.icon
                    className={`${isCollapsed ? "h-5 w-5" : "mr-3 h-5 w-5"}`}
                  />
                )}
                {!isCollapsed && item.name}

                {isCollapsed && (
                  <div className="absolute left-14 bg-green-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom section: Profile, Help, Settings, Logout */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4 space-y-2 mt-auto">
            <NavLink
              to="/profile"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : ""
              } py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md`}
            >
              <User className={`${isCollapsed ? "h-5 w-5" : "mr-3 h-5 w-5"}`} />
              {!isCollapsed && "Profile"}
            </NavLink>

            <a
              href="#"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : ""
              } py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md`}
            >
              <HelpCircle
                className={`${isCollapsed ? "h-5 w-5" : "mr-3 h-5 w-5"}`}
              />
              {!isCollapsed && "Help"}
            </a>

            <a
              href="#"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : ""
              } py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md`}
            >
              <Settings
                className={`${isCollapsed ? "h-5 w-5" : "mr-3 h-5 w-5"}`}
              />
              {!isCollapsed && "Settings"}
            </a>

            <button
              onClick={handleLogout}
              className={`flex items-center ${
                isCollapsed ? "justify-center" : ""
              } py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md w-full`}
            >
              <LogOut
                className={`${isCollapsed ? "h-5 w-5" : "mr-3 h-5 w-5"}`}
              />
              {!isCollapsed && "Sign out"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
