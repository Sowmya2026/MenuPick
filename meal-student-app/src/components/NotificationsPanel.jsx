import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { Bell, X, Clock, Settings, Trash2, Utensils, AlertCircle } from 'lucide-react';

export default function NotificationsPanel() {
  const { 
    activeNotifications, 
    clearNotification, 
    clearAllNotifications,
    notifications,
    updateNotificationPreference,
    getMessColorTheme
  } = useNotification();
  
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (subType) => {
    switch (subType) {
      case 'start':
        return <Utensils size={14} className="text-green-500" />;
      case 'end':
        return <AlertCircle size={14} className="text-red-500" />;
      default:
        return <Bell size={14} className="text-blue-500" />;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getNotificationColor = (messType) => {
    const theme = getMessColorTheme(messType);
    return theme.bg;
  };

  return (
    <>
      {/* Notification Bell Icon */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Bell size={20} />
          {activeNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {activeNotifications.length}
            </span>
          )}
        </button>

        {/* Notifications Panel */}
        {isOpen && (
          <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Meal Notifications</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearAllNotifications}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Clear all"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {activeNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No notifications yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Meal reminders will appear here
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {activeNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 hover:bg-gray-50 transition-colors border-l-4"
                      style={{ borderLeftColor: getNotificationColor(notification.messType) }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.subType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            <span 
                              className="text-xs px-2 py-1 rounded-full text-white capitalize"
                              style={{ backgroundColor: getNotificationColor(notification.messType) }}
                            >
                              {notification.messType}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          
                          {/* Menu items for start notifications */}
                          {notification.subType === 'start' && notification.menuItems.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-gray-500 font-medium mb-1">
                                Today's Menu:
                              </div>
                              <div className="space-y-1">
                                {notification.menuItems.slice(0, 3).map((item, index) => (
                                  <div key={index} className="flex items-start">
                                    <span className="text-gray-400 text-xs mr-2 mt-0.5">•</span>
                                    <span className="text-gray-600 text-xs leading-relaxed truncate">
                                      {item}
                                    </span>
                                  </div>
                                ))}
                                {notification.menuItems.length > 3 && (
                                  <div className="text-xs text-gray-400">
                                    +{notification.menuItems.length - 3} more items
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400 flex items-center">
                              <Clock size={10} className="mr-1" />
                              {formatTime(notification.timestamp)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-400">
                                {notification.timing}
                              </span>
                              <button
                                onClick={() => clearNotification(notification.id)}
                                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Meal reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.mealReminders}
                    onChange={(e) => updateNotificationPreference('mealReminders', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Notifications 15min before start and 30min before end
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}