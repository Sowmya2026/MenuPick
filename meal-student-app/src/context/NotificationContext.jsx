import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { useMenu } from "./MenuContext";
import {
  getFCMToken,
  onForegroundMessage,
  initializeMessaging,
} from "../services/firebaseConfig";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { toast } from "react-hot-toast";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { getTimings, selectedMess, getMenuItems } = useMenu();
  const [notifications, setNotifications] = useState({
    mealReminders: true,
    preferenceUpdates: true,
    specialOffers: false,
    monthlyReports: true,
    pushNotifications: false,
  });

  const [activeNotifications, setActiveNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");

  // Default color themes
  const defaultColorThemes = {
    veg: {
      primary: "green",
      gradient: "from-green-500 to-green-600",
      light: "green-50",
      border: "border-green-200",
      text: "text-green-600",
      bg: "bg-green-500",
    },
    "non-veg": {
      primary: "red",
      gradient: "from-red-500 to-red-600",
      light: "red-50",
      border: "border-red-200",
      text: "text-red-600",
      bg: "bg-red-500",
    },
    special: {
      primary: "purple",
      gradient: "from-purple-500 to-purple-600",
      light: "purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      bg: "bg-purple-500",
    },
    default: {
      primary: "blue",
      gradient: "from-blue-500 to-blue-600",
      light: "blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      bg: "bg-blue-500",
    }
  };

  // Check current permission status
  const checkPermissionStatus = useCallback(() => {
    if (!("Notification" in window)) {
      setPermissionStatus("unsupported");
      setHasPermission(false);
      return "unsupported";
    }

    const status = Notification.permission;
    setPermissionStatus(status);
    setHasPermission(status === "granted");
    return status;
  }, []);

  // Save FCM token to Firestore
  const saveFCMTokenToFirestore = async (token) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          fcmTokens: [...(userSnap.data().fcmTokens || []), token],
          notificationEnabled: true,
          lastTokenUpdate: new Date(),
        });
      } else {
        await setDoc(userRef, {
          fcmTokens: [token],
          notificationEnabled: true,
          createdAt: new Date(),
        });
      }

      console.log("FCM token saved to Firestore");
    } catch (error) {
      console.error("Error saving FCM token to Firestore:", error);
    }
  };

  // Remove FCM token from Firestore
  const removeFCMTokenFromFirestore = async (token) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const currentTokens = userSnap.data().fcmTokens || [];
        const updatedTokens = currentTokens.filter((t) => t !== token);

        await updateDoc(userRef, {
          fcmTokens: updatedTokens,
          notificationEnabled: updatedTokens.length > 0,
        });
      }
    } catch (error) {
      console.error("Error removing FCM token from Firestore:", error);
    }
  };

  // Initialize push notifications
  const initializePushNotifications = useCallback(async () => {
    try {
      checkPermissionStatus();

      if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return;
      }

      await initializeMessaging();

      // Set up foreground message handler
      onForegroundMessage((payload) => {
        console.log("Foreground message received:", payload);
        handlePushNotification(payload);
      });

      // Only try to get token if permission is granted
      if (permissionStatus === "granted" && notifications.pushNotifications) {
        try {
          const token = await getFCMToken();
          setFcmToken(token);
          await saveFCMTokenToFirestore(token);
        } catch (error) {
          // This is expected when permissions are denied - don't log as error
          if (!error.message.includes('permission')) {
            console.log("Could not get FCM token:", error.message);
          }
        }
      }
    } catch (error) {
      console.log("Error initializing push notifications:", error.message);
    }
  }, [
    checkPermissionStatus,
    permissionStatus,
    notifications.pushNotifications,
  ]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    try {
      const currentStatus = checkPermissionStatus();

      // If already denied, return gracefully
      if (currentStatus === "denied") {
        return "permission_denied";
      }

      // If already granted, try to get token
      if (currentStatus === "granted") {
        try {
          const token = await getFCMToken();
          setFcmToken(token);
          await saveFCMTokenToFirestore(token);
          return token;
        } catch (error) {
          // Permission granted but token failed - this is okay
          return "permission_granted";
        }
      }

      // Request permission if default
      if (currentStatus === "default") {
        const permission = await Notification.requestPermission();
        checkPermissionStatus();

        if (permission === "granted") {
          try {
            const token = await getFCMToken();
            setFcmToken(token);
            await saveFCMTokenToFirestore(token);
            toast.success("Push notifications enabled!");
            return token;
          } catch (error) {
            // Permission granted but token failed
            toast.success("Notifications enabled!");
            return "permission_granted";
          }
        } else {
          // Permission denied
          return "permission_denied";
        }
      }
    } catch (error) {
      console.log("Error in permission request:", error.message);
      return "error";
    }
  };

  // Handle push notification
  const handlePushNotification = (payload) => {
    const { notification, data } = payload;

    const notificationObj = {
      id: Date.now(),
      type: data?.type || "general",
      subType: data?.subType,
      title: notification?.title || "MenuPick",
      message: notification?.body || "You have a new notification",
      timestamp: new Date(),
      data: data || {},
      isPush: true,
      colorTheme: defaultColorThemes[data?.messType] || defaultColorThemes.default,
      messType: data?.messType || "default"
    };

    setCurrentNotification(notificationObj);
    setShowNotification(true);
    setActiveNotifications((prev) => [notificationObj, ...prev.slice(0, 9)]);

    setTimeout(() => {
      setShowNotification(false);
    }, 8000);

    if (notification?.title && notification?.body) {
      toast.success(notification.body, {
        duration: 4000,
        icon: "🔔",
      });
    }
  };

  // Enable/disable push notifications
  const togglePushNotifications = async (enable) => {
    try {
      if (enable) {
        // If permission is already denied, show helpful message
        if (permissionStatus === "denied") {
          toast.error(
            "Notifications are blocked in your browser settings. Please enable them to receive push notifications.",
            {
              duration: 6000,
              icon: "🔔",
            }
          );
          return false;
        }

        const result = await requestNotificationPermission();
        
        if (result === "permission_denied") {
          toast.error(
            "To enable push notifications, please allow notifications in your browser settings.",
            {
              duration: 5000,
              icon: "🔔",
            }
          );
          return false;
        } else {
          // Success - permission granted (with or without token)
          updateNotificationPreference("pushNotifications", true);
          return true;
        }
      } else {
        // Disabling notifications
        setHasPermission(false);
        setFcmToken(null);
        updateNotificationPreference("pushNotifications", false);

        // Remove token from Firestore
        if (fcmToken) {
          await removeFCMTokenFromFirestore(fcmToken);
        }

        toast.success("Push notifications disabled");
        return true;
      }
    } catch (error) {
      console.log("Error toggling push notifications:", error.message);
      return false;
    }
  };

  // Get color theme based on mess preference
  const getMessColorTheme = (messType) => {
    return defaultColorThemes[messType] || defaultColorThemes.veg;
  };

  // Update notification preference
  const updateNotificationPreference = (key, value) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: value };
      if (currentUser) {
        localStorage.setItem(
          `notifications_${currentUser.uid}`,
          JSON.stringify(updated)
        );
      }
      return updated;
    });
  };

  // Initialize when user logs in
  useEffect(() => {
    checkPermissionStatus();

    if (currentUser && notifications.pushNotifications) {
      initializePushNotifications();
    }
  }, [
    currentUser,
    notifications.pushNotifications,
    initializePushNotifications,
    checkPermissionStatus,
  ]);

  // Load user preferences
  useEffect(() => {
    if (currentUser) {
      const savedNotifications = localStorage.getItem(
        `notifications_${currentUser.uid}`
      );
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }

      const savedToken = localStorage.getItem(`fcm_token_${currentUser.uid}`);
      if (savedToken) {
        setFcmToken(savedToken);
      }
    }
  }, [currentUser]);

  const value = {
    notifications,
    updateNotificationPreference,
    activeNotifications,
    clearNotification: (id) =>
      setActiveNotifications((prev) => prev.filter((notif) => notif.id !== id)),
    clearAllNotifications: () => setActiveNotifications([]),
    showNotification,
    currentNotification,
    dismissNotification: () => {
      setShowNotification(false);
      setCurrentNotification(null);
    },
    getCurrentTimings: useCallback(
      () => getTimings(selectedMess),
      [getTimings, selectedMess]
    ),
    getNotificationTimes: useCallback(() => {
      const timings = getTimings(selectedMess);
      const notificationTimes = {};

      Object.entries(timings).forEach(([meal, timeRange]) => {
        const timeParts = timeRange.split(" - ");
        const startTime = timeParts[0];
        const [time, modifier] = startTime.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        const startNotificationTime = new Date(date);
        startNotificationTime.setMinutes(
          startNotificationTime.getMinutes() - 15
        );

        const endNotificationTime = new Date(date);
        endNotificationTime.setMinutes(endNotificationTime.getMinutes() + 30);

        notificationTimes[meal] = {
          start: startNotificationTime,
          end: endNotificationTime,
          timing: timeRange,
        };
      });

      return notificationTimes;
    }, [getTimings, selectedMess]),
    getMessColorTheme,
    requestNotificationPermission,
    togglePushNotifications,
    hasPermission,
    permissionStatus,
    checkPermissionStatus,
    fcmToken,
    saveFCMTokenToFirestore,
    removeFCMTokenFromFirestore,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationPopup />
    </NotificationContext.Provider>
  );
};

// NotificationPopup Component
const NotificationPopup = () => {
  const { showNotification, currentNotification, dismissNotification } =
    useContext(NotificationContext);

  if (!showNotification || !currentNotification) return null;

  const colorTheme = currentNotification.colorTheme || {
    border: "border-blue-200",
    gradient: "from-blue-500 to-blue-600",
    text: "text-blue-600"
  };

  const isStartNotification = currentNotification.subType === "start";

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-fade-in">
      <div className={`bg-white rounded-lg shadow-xl ${colorTheme.border} border-2 overflow-hidden`}>
        <div className={`bg-gradient-to-r ${colorTheme.gradient} p-4`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">
              {currentNotification.title}
            </h3>
            <button
              onClick={dismissNotification}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-white text-xs mt-1 opacity-90">
            {currentNotification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-white text-xs bg-black bg-opacity-20 px-2 py-1 rounded-full">
              {currentNotification.messType?.toUpperCase() || "MEAL"} MESS
            </span>
            <span className="text-white text-xs">
              {currentNotification.timing || "Now"}
            </span>
          </div>
        </div>

        {isStartNotification && currentNotification.menuItems && currentNotification.menuItems.length > 0 && (
          <div className="p-4 bg-white">
            <div className="flex items-center mb-2">
              <span className={`${colorTheme.text} font-semibold text-xs uppercase tracking-wide`}>
                Today's Menu
              </span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {currentNotification.menuItems.map((item, index) => (
                <div key={index} className="flex items-start">
                  <span className={`${colorTheme.text} text-xs mr-2 mt-0.5`}>•</span>
                  <span className="text-gray-700 text-xs leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">
              {currentNotification.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {!isStartNotification && (
              <span className="text-red-500 text-xs font-medium animate-pulse">
                ⏰ Ending soon!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export default NotificationContext;