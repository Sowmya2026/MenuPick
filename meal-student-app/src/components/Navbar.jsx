import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";
import { showLogoutConfirmation } from "../utils/alertUtils";
import Logo from "./Logo";
import {
  User,
  LogOut,
  Settings,
  Bell,
  Home,
  Utensils,
  MessageSquare,
} from "lucide-react";

const LoggedInNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { activeNotifications, clearNotification, clearAllNotifications } = useNotification();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const handleLogout = async () => {
    const result = await showLogoutConfirmation();
    if (result.isConfirmed) {
      try {
        await logout();
        setIsProfileOpen(false);
      } catch (error) {
        console.error("Failed to log out");
      }
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { path: "/", icon: Home, label: "Home" },

    { path: "/feedback", icon: MessageSquare, label: "Feedback" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b"
      style={{
        background: `${theme.colors.card}f5`,
        borderColor: theme.colors.border,
      }}
    >
      <div className="md:max-w-6xl md:mx-auto w-full px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="md" withText={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                style={{
                  background: location.pathname === item.path ? theme.colors.backgroundTertiary : 'transparent',
                  color: location.pathname === item.path ? theme.colors.primary : theme.colors.textSecondary,
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-xl transition-all relative"
                style={{
                  background: isNotificationsOpen ? theme.colors.backgroundTertiary : 'transparent',
                  color: theme.colors.text,
                }}
              >
                <Bell className="w-5 h-5" />
                {activeNotifications > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{ background: '#ef4444' }}
                  >
                    {activeNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    background: theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <div className="p-4 border-b" style={{ borderColor: theme.colors.border }}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold" style={{ color: theme.colors.text }}>
                        Notifications
                      </h3>
                      {activeNotifications > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-sm font-medium"
                          style={{ color: theme.colors.primary }}
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {activeNotifications === 0 ? (
                      <div className="p-8 text-center" style={{ color: theme.colors.textSecondary }}>
                        No new notifications
                      </div>
                    ) : (
                      <div className="p-2">
                        <p className="p-4 text-sm" style={{ color: theme.colors.textSecondary }}>
                          Notifications will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                style={{
                  background: isProfileOpen ? theme.colors.backgroundTertiary : 'transparent',
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: theme.colors.primary }}
                >
                  {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="font-medium hidden lg:block" style={{ color: theme.colors.text }}>
                  {currentUser?.name || 'User'}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    background: theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <div
                    className="p-4 border-b"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                      borderColor: theme.colors.border,
                    }}
                  >
                    <p className="font-bold text-white">{currentUser?.name || 'User'}</p>
                    <p className="text-sm text-white/80 truncate">{currentUser?.email}</p>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                      style={{
                        color: theme.colors.text,
                        background: location.pathname === '/profile' ? theme.colors.backgroundSecondary : 'transparent',
                      }}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
                      style={{ color: '#ef4444' }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LoggedInNavbar;