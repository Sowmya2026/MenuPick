import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import InstallPrompt from "./InstallPrompt";
import {
  Home,
  Utensils,
  BarChart,
  MessageSquare,
  Menu,
  User,
  FileJson,
} from "lucide-react";

import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        const adminDoc = await getDoc(doc(db, "adminUsers", currentUser.uid));
        // If not an admin user and NOT already on the setup page (prevent infinite loop if logic fails)
        if (!adminDoc.exists()) {
          // For safety, only redirect if we are sure they aren't authorized
          navigate("/admin-setup");
        }
      }
    };
    checkAdminStatus();
  }, [currentUser, navigate]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Meals", href: "/meals", icon: Utensils },
    { name: "Import", href: "/menu-import", icon: FileJson },
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
      className="h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 flex overflow-hidden"
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
          className="flex-1 relative overflow-y-auto focus:outline-none p-2 sm:p-4 lg:p-6 pb-20 lg:pb-6"
          onClick={(e) => e.stopPropagation()}
        >
          <Outlet />
        </main>

        {/* Install Prompt */}
        <InstallPrompt />

        {/* Bottom Navigation Bar - Mobile Only */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-green-200 z-30 shadow-lg">
          <div className="flex justify-around items-center py-3">
            {" "}
            {/* Increased padding */}
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`flex flex-col items-center p-2 transition-all duration-200 flex-1 mx-1 rounded-lg ${isActiveRoute(item.href)
                  ? "text-green-700 bg-green-100"
                  : "text-green-600 hover:text-green-700"
                  }`}
              >
                <item.icon
                  className={`h-5 w-5 ${isActiveRoute(item.href) ? "scale-110" : "scale-100"
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
