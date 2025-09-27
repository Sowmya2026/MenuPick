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
  { name: "Profile", href: "/profile", icon: User },
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSidebarClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Mobile sidebar */}
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />

        <div className="fixed inset-0 flex">
          <Dialog.Panel
            className="relative flex-1 flex flex-col w-full max-w-xs bg-white"
            onClick={handleSidebarClick}
            ref={sidebarRef}
          >
            {/* Close button */}
            <div className="absolute top-3 right-3 z-50">
              <button
                className="flex items-center justify-center h-8 w-8 rounded-full bg-green-200 bg-opacity-80 hover:bg-green-100 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5 text-green-600" />
              </button>
            </div>

            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              {/* Logo */}
              <div className="flex items-center justify-center px-4 mb-4">
                <h1 className="text-lg font-bold text-green-900">Meal Admin</h1>
              </div>

              {/* Navigation */}
              <nav className="px-3 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>

              {/* User info */}
              <div className="mt-auto px-4 py-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-3 px-2">
                  Logged in as:{" "}
                  <span className="font-medium">{currentUser?.email}</span>
                </div>

                {/* Bottom actions */}
                <div className="space-y-1">
                  <a
                    href="#"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                  >
                    <HelpCircle className="mr-3 h-4 w-4" />
                    Help
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex lg:flex-shrink-0 ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } transition-all duration-300 ease-in-out`}
        ref={sidebarRef}
      >
        <div className="flex flex-col w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 border-r border-green-200">
          {/* Top section with toggle */}
          <div className="flex items-center justify-between p-4 border-b border-green-200">
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-green-900">Admin Panel</h1>
            )}

            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-green-700 hover:bg-green-200 hover:bg-opacity-50 hover:text-green-900 transition-all duration-200"
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
                  } py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? " bg-opacity-50 text-green-900 border border-green-300 shadow-sm"
                      : "text-green-800 hover:bg-green-200 hover:bg-opacity-50 hover:text-green-900"
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
          <div className="flex-shrink-0 border-t border-green-200 p-4 space-y-2 mt-auto">
            <NavLink
              to="/profile"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : ""
              } py-2 text-sm font-medium text-green-800 hover:bg-green-200 hover:bg-opacity-50 hover:text-green-900 rounded-lg transition-colors`}
            >
              <User className={`${isCollapsed ? "h-5 w-5" : "mr-3 h-5 w-5"}`} />
              {!isCollapsed && "Profile"}
            </NavLink>

            <a
              href="#"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : ""
              } py-2 text-sm font-medium text-green-800 hover:bg-green-200 hover:bg-opacity-50 hover:text-green-900 rounded-lg transition-colors`}
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
              } py-2 text-sm font-medium text-green-800 hover:bg-green-200 hover:bg-opacity-50 hover:text-green-900 rounded-lg transition-colors`}
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
              } py-2 text-sm font-medium text-green-800 hover:bg-green-200 hover:bg-opacity-50 hover:text-green-900 rounded-lg w-full transition-colors`}
            >
              <LogOut
                className={`${isCollapsed ? "h-5 w-5" : "mr-3 h-5 w-5"}`}
              />
              {!isCollapsed && "Sign out"}
            </button>

            {/* User email */}
            {!isCollapsed && (
              <div className="pt-2 mt-2 border-t border-green-200">
                <div className="text-xs text-green-700 px-2">
                  Logged in as:{" "}
                  <span className="font-medium">{currentUser?.email}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
