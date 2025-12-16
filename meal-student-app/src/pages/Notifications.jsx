import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Clock,
  Utensils,
  Trash2,
  BellOff,
  Check,
} from "lucide-react";

const Notifications = () => {
  const { theme } = useTheme();
  const {
    activeNotifications,
    clearNotification,
    clearAllNotifications,
    notifications,
  } = useNotification();
  const { currentUser } = useAuth();

  const getNotificationIcon = (type, subType) => {
    if (type === "mealReminder") {
      if (subType === "start") {
        return (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: theme.colors.primary + "20" }}
          >
            <Utensils className="w-5 h-5" style={{ color: theme.colors.primary }} />
          </div>
        );
      } else {
        return (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#f59e0b20" }}
          >
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        );
      }
    }
    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: "#3b82f620" }}
      >
        <Bell className="w-5 h-5 text-blue-500" />
      </div>
    );
  };

  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

    return notificationTime.toLocaleDateString();
  };

  return (
    <div className="pb-20" style={{ background: theme.colors.background }}>
      {/* Header */}
      <div
        className="px-4 sm:px-6 py-4 sm:py-6 border-b"
        style={{
          background: theme.colors.card,
          borderColor: theme.colors.border,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: theme.colors.text }}>
              Notifications
            </h1>
            <p className="text-xs sm:text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
              {activeNotifications.length > 0
                ? `${activeNotifications.length} unread notification${activeNotifications.length > 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>

          {/* Badge */}
          {activeNotifications.length > 0 && (
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold text-white"
              style={{ background: theme.colors.primary }}
            >
              {activeNotifications.length > 9 ? '9+' : activeNotifications.length}
            </div>
          )}
        </div>

        {/* Clear All Button */}
        {activeNotifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="mt-3 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm text-white"
            style={{ background: '#EF4444' }}
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-3xl mx-auto">
        <AnimatePresence mode="popLayout">
          {activeNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12 sm:py-16 rounded-2xl"
              style={{
                background: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center"
                style={{ background: theme.colors.backgroundSecondary }}
              >
                <BellOff className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: theme.colors.textTertiary }} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: theme.colors.text }}>
                No Notifications
              </h3>
              <p className="text-sm sm:text-base" style={{ color: theme.colors.textSecondary }}>
                Meal reminders and alerts will appear here
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {activeNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl p-4 relative overflow-hidden"
                  style={{
                    background: theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type, notification.subType)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-semibold mb-1" style={{ color: theme.colors.text }}>
                        {notification.title}
                      </h4>
                      <p className="text-xs sm:text-sm mb-2" style={{ color: theme.colors.textSecondary }}>
                        {notification.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs" style={{ color: theme.colors.textTertiary }}>
                          {formatNotificationTime(notification.timestamp)}
                        </span>
                        {notification.timing && (
                          <span
                            className="text-xs px-2 py-1 rounded-lg font-medium"
                            style={{
                              background: theme.colors.backgroundTertiary,
                              color: theme.colors.primary,
                            }}
                          >
                            {notification.timing}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dismiss Button */}
                    <button
                      onClick={() => clearNotification(notification.id)}
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{
                        background: theme.colors.backgroundSecondary,
                        color: theme.colors.textSecondary,
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Settings Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 sm:mt-8 p-4 rounded-2xl"
          style={{
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.colors.primary }} />
              <span className="text-sm sm:text-base font-medium" style={{ color: theme.colors.text }}>
                Meal Reminders
              </span>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${notifications.mealReminders
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
                }`}
            >
              {notifications.mealReminders ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Enabled
                </span>
              ) : (
                "Disabled"
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm" style={{ color: theme.colors.textSecondary }}>
            Manage notification preferences in your settings
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;
