import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Activity,
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
    { name: "Activities", href: "/user-activities", icon: Activity },
    { name: "Meals", href: "/meals", icon: Utensils },
    { name: "Import", href: "/menu-import", icon: FileJson },
    { name: "Analytics", href: "/analytics", icon: BarChart },
    { name: "Feedback", href: "/feedback", icon: MessageSquare },
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

        {/* Bottom Navigation Bar - Mobile Only - Old Style Design */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-xl border-t border-green-200 shadow-[0_-8px_30px_-6px_rgba(0,0,0,0.1)]">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActiveRoute(item.href);

                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className="relative flex items-center"
                  >
                    <motion.div
                      layout
                      className={`relative flex items-center justify-center rounded-xl overflow-hidden ${active ? 'px-3 py-2' : 'p-2'
                        }`}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {/* Active Background Layer */}
                      {active && (
                        <motion.div
                          layoutId="admin-nav-bg"
                          className="absolute inset-0 bg-green-100 border border-green-200 rounded-xl"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}

                      {/* Icon & Label Container */}
                      <div className="relative z-10 flex items-center gap-1.5">
                        <Icon
                          size={18}
                          className={active ? 'text-green-700' : 'text-green-600'}
                          strokeWidth={active ? 2.5 : 2}
                        />

                        {/* Animated Label */}
                        {active && (
                          <motion.span
                            initial={{ width: 0, opacity: 0, x: -10 }}
                            animate={{ width: "auto", opacity: 1, x: 0 }}
                            exit={{ width: 0, opacity: 0, x: -10 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="text-xs font-bold whitespace-nowrap overflow-hidden text-green-700"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
