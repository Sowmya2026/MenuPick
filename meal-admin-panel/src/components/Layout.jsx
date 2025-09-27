import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Home,
  Utensils,
  BarChart,
  MessageSquare,
  Menu,
  User,
} from "lucide-react"; // Added User import

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Meals", href: "/meals", icon: Utensils },
    { name: "Analytics", href: "/analytics", icon: BarChart },
    { name: "Feedback", href: "/feedback", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User }, // Added profile
  ];

  // Close sidebar when clicking on the main content area
  const handleLayoutClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const isActiveRoute = (href) => {
    return location.pathname === href;
  };

  return (
    <div
      className="h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 flex overflow-hidden bg-gray-100"
      onClick={handleLayoutClick}
    >
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main
          className="flex-1 relative overflow-y-auto focus:outline-none p-4 lg:p-6 pb-20 lg:pb-6"
          onClick={(e) => e.stopPropagation()}
        >
          <Outlet />
        </main>

        {/* Bottom Navigation Bar - Mobile Only */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 backdrop-blur-sm border-t border-green-200 z-30">
          <div className="flex justify-around items-center py-3">
            {" "}
            {/* Increased padding */}
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`flex flex-col items-center p-2 transition-all duration-200 flex-1 mx-1 rounded-lg ${
                  isActiveRoute(item.href)
                    ? "text-green-700 bg-green-100"
                    : "text-green-600 hover:text-green-700"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActiveRoute(item.href) ? "scale-110" : "scale-100"
                  } transition-transform duration-200`}
                />{" "}
                {/* Increased icon size */}
                <span className="text-xs font-medium mt-1">
                  {" "}
                  {/* Increased text size */}
                  {isActiveRoute(item.href) ? item.name : ""}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
