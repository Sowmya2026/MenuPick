import { Link, useLocation } from "react-router-dom";
import { Home, Utensils, User, MessageSquare, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMenu } from "../context/MenuContext";
import { useNotification } from "../context/NotificationContext";

const BottomNavigation = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { selectedMess } = useMenu();
  const { activeNotifications } = useNotification();

  const getColorTheme = () => {
    const colors = {
      veg: { active: "text-green-600", bg: "bg-green-500" },
      "non-veg": { active: "text-red-600", bg: "bg-red-500" },
      special: { active: "text-purple-600", bg: "bg-purple-500" },
    };
    return colors[selectedMess] || colors.veg;
  };

  const theme = getColorTheme();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/selection", icon: Utensils, label: "Meals" },
    { path: "/feedback", icon: MessageSquare, label: "Feedback" },
    {
      path: "/notifications",
      icon: Bell,
      label: "Alerts",
      isNotification: true,
    },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  if (!currentUser) return null;

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0 
        bg-white/95 backdrop-blur-md
        md:hidden z-50
        border-t border-gray-100
        shadow-sm
        safe-area-inset-b
      "
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex justify-around items-center px-1 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const hasNotifications =
            item.isNotification && activeNotifications.length > 0;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-1.5 rounded-xl transition-all duration-200 relative group min-w-[55px] ${
                isActive ? "transform -translate-y-0.5" : ""
              }`}
            >
              {/* Notification Badge */}
              {hasNotifications && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] rounded-full h-3 w-3 flex items-center justify-center border border-white z-10">
                  {activeNotifications.length > 9
                    ? "9+"
                    : activeNotifications.length}
                </span>
              )}

              {/* Icon */}
              <div
                className={`p-1.5 rounded-lg transition-all duration-200 relative ${
                  isActive
                    ? `${theme.bg} text-white shadow-xs`
                    : "text-gray-600 group-hover:text-black"
                }`}
              >
                <Icon size={21} />

                {hasNotifications && !isActive && (
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-medium mt-0.5 transition-colors ${
                  isActive ? theme.active : "text-gray-600"
                }`}
              >
                {item.label}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <div
                  className={`absolute -bottom-0.5 w-0.5 h-0.5 rounded-full ${theme.bg} animate-pulse`}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;