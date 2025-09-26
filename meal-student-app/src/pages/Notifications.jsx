import { useNotification } from '../context/NotificationContext';
import { Bell, CheckCircle, Clock, Utensils, X } from 'lucide-react';

const Notifications = () => {
  const { 
    activeNotifications, 
    clearNotification, 
    clearAllNotifications,
    notifications 
  } = useNotification();

  const getNotificationIcon = (type, subType) => {
    if (type === 'mealReminder') {
      if (subType === 'start') {
        return <Utensils size={16} className="text-green-500" />;
      } else {
        return <Clock size={16} className="text-amber-500" />;
      }
    }
    return <Bell size={16} className="text-blue-500" />;
  };

  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return notificationTime.toLocaleDateString();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 text-sm mt-1">
            Your recent alerts and reminders
          </p>
        </div>
        {activeNotifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {activeNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500 text-sm">
              Meal reminders and alerts will appear here
            </p>
          </div>
        ) : (
          activeNotifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type, notification.subType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatNotificationTime(notification.timestamp)}
                      </span>
                      {notification.timing && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {notification.timing}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => clearNotification(notification.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors ml-2"
                  title="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Settings Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Meal reminders</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            notifications.mealReminders 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            {notifications.mealReminders ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Manage notification settings in your profile
        </p>
      </div>
    </div>
  );
};

export default Notifications;