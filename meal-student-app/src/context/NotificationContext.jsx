import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { useMenu } from "./MenuContext";
import { toast } from "react-hot-toast";
import {
  showAlert,
  showSuccess,
  showError,
} from "../utils/alertUtils";
import {
  getFCMToken,
  onForegroundMessage,
  initializeMessaging,
  db
} from "../services/firebaseConfig";
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
// ... (rest of file)

// ...

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
  // ...
  // Add this useEffect to NotificationContext.js
  useEffect(() => {
    // Listen for test notifications
    const handleTestNotification = (event) => {
      const testNotification = event.detail;
      setCurrentNotification(testNotification);
      setShowNotification(true);
      setActiveNotifications((prev) => [testNotification, ...prev.slice(0, 9)]);
    };

    window.addEventListener("test-notification", handleTestNotification);

    return () => {
      window.removeEventListener("test-notification", handleTestNotification);
    };
  }, []);

  const [activeNotifications, setActiveNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [hasShownInitialPrompt, setHasShownInitialPrompt] = useState(false);



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
    },
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
          notifications_enabled: true,
        });
      } else {
        await setDoc(userRef, {
          fcmTokens: [token],
          notificationEnabled: true,
          notifications_enabled: true,
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
          notifications_enabled: updatedTokens.length > 0,
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
          if (!error.message.includes("permission")) {
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

  // NEW: Show initial permission modal after sign-in
  const showInitialPermissionModal = useCallback(() => {
    if (!currentUser) return;

    // Check if we've already shown the prompt for this user
    const hasShown = localStorage.getItem(
      `notification_prompt_shown_${currentUser.uid}`
    );
    if (hasShown) return;

    const currentStatus = checkPermissionStatus();

    // Only show if permission hasn't been decided yet
    if (currentStatus === "default" && !hasShownInitialPrompt) {
      setTimeout(() => {
        setShowPermissionModal(true);
        setHasShownInitialPrompt(true);
      }, 2000); // Show after 2 seconds on home page
    }
  }, [currentUser, checkPermissionStatus, hasShownInitialPrompt]);

  // NEW: Handle permission modal actions
  const handleAllowNotifications = async () => {
    try {
      setShowPermissionModal(false);

      // Mark as shown for this user
      if (currentUser) {
        localStorage.setItem(
          `notification_prompt_shown_${currentUser.uid}`,
          "true"
        );
      }

      const permission = await Notification.requestPermission();
      checkPermissionStatus();

      if (permission === "granted") {
        try {
          const token = await getFCMToken();
          setFcmToken(token);
          await saveFCMTokenToFirestore(token);
          setNotifications((prev) => ({ ...prev, pushNotifications: true }));
          showSuccess(
            "Notifications Enabled",
            "You'll receive updates, alerts, and offers from Menu!"
          );
        } catch (error) {
          // Permission granted but token failed - still enable notifications
          setNotifications((prev) => ({ ...prev, pushNotifications: true }));
          showSuccess(
            "Notifications Enabled",
            "You'll receive updates and alerts from Menu!"
          );
        }
      } else {
        // User denied permission
        setNotifications((prev) => ({ ...prev, pushNotifications: false }));
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);
          await updateDoc(userRef, {
            notifications_enabled: false,
          });
        }
      }
    } catch (error) {
      console.log("Error requesting notification permission:", error);
      setShowPermissionModal(false);
    }
  };

  const handleDenyNotifications = async () => {
    setShowPermissionModal(false);

    // Mark as shown for this user
    if (currentUser) {
      localStorage.setItem(
        `notification_prompt_shown_${currentUser.uid}`,
        "true"
      );
    }

    // Save preference in database
    setNotifications((prev) => ({ ...prev, pushNotifications: false }));

    if (currentUser) {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          notifications_enabled: false,
        });
      } catch (error) {
        console.error("Error updating notification preference:", error);
      }
    }
  };

  // Request notification permission (for manual enable from settings)
  const requestNotificationPermission = async () => {
    try {
      const currentStatus = checkPermissionStatus();

      // If already denied, show alert and return
      if (currentStatus === "denied") {
        showAlert(
          "Permission Blocked",
          "Please enable notifications manually from your device or browser settings."
        );
        return "permission_denied";
      }

      // If already granted, try to get token
      if (currentStatus === "granted") {
        try {
          const token = await getFCMToken();
          setFcmToken(token);
          await saveFCMTokenToFirestore(token);
          setNotifications((prev) => ({ ...prev, pushNotifications: true }));
          return token;
        } catch (error) {
          // Permission granted but token failed - this is okay
          setNotifications((prev) => ({ ...prev, pushNotifications: true }));
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
            setNotifications((prev) => ({ ...prev, pushNotifications: true }));
            showSuccess(
              "Notifications Enabled",
              "Push notifications are now active!"
            );
            return token;
          } catch (error) {
            // Permission granted but token failed
            setNotifications((prev) => ({ ...prev, pushNotifications: true }));
            showSuccess(
              "Notifications Enabled",
              "You'll receive in-app notifications!"
            );
            return "permission_granted";
          }
        } else {
          // Permission denied
          setNotifications((prev) => ({ ...prev, pushNotifications: false }));
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
      title: notification?.title || "Menu",
      message: notification?.body || "You have a new notification",
      timestamp: new Date(),
      data: data || {},
      isPush: true,
      colorTheme:
        defaultColorThemes[data?.messType] || defaultColorThemes.default,
      messType: data?.messType || "default",
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
          showAlert(
            "Permission Blocked",
            "Please enable notifications manually from your device or browser settings."
          );
          return false;
        }

        const result = await requestNotificationPermission();

        if (result === "permission_denied") {
          showAlert(
            "Permission Required",
            "To enable push notifications, please allow notifications in your browser settings."
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

        showSuccess(
          "Notifications Disabled",
          "Push notifications have been turned off."
        );
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
  const updateNotificationPreference = async (key, value) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: value };
      if (currentUser) {
        localStorage.setItem(
          `notifications_${currentUser.uid}`,
          JSON.stringify(updated)
        );

        // Sync to Firestore
        const userRef = doc(db, "users", currentUser.uid);
        setDoc(userRef, {
          settings: {
            notifications: {
              [key]: value
            }
          }
        }, { merge: true }).catch(err => console.error("Error saving notification pref:", err));
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

  // Load user preferences and Listen for changes
  useEffect(() => {
    let unsubscribe;

    if (currentUser) {
      // 1. Load from LocalStorage (fast initial load)
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

      // 2. Setup Firestore Listener for Real-time Sync
      try {
        const userRef = doc(db, "users", currentUser.uid);
        unsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const settings = data.settings || {};
            const remoteNotifications = settings.notifications;

            if (remoteNotifications) {
              console.log("☁️ Syncing notifications from account");
              setNotifications(prev => {
                const newState = { ...prev, ...remoteNotifications };
                // Update local storage to match
                localStorage.setItem(
                  `notifications_${currentUser.uid}`,
                  JSON.stringify(newState)
                );
                return newState;
              });
            }
          }
        });
      } catch (error) {
        console.error("Error setting up notification sync:", error);
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  // In NotificationContext.js - add this to the value object
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
    showPermissionModal,
    setShowPermissionModal,
    handleAllowNotifications,
    handleDenyNotifications,
    // ADD THIS FUNCTION:
    showInitialPermissionModal: useCallback(() => {
      if (!currentUser) return;

      // Check if we've already shown the prompt for this user
      const hasShown = localStorage.getItem(`notification_prompt_shown_${currentUser.uid}`);
      if (hasShown) return;

      const currentStatus = checkPermissionStatus();

      // Only show if permission hasn't been decided yet
      if (currentStatus === "default" && !hasShownInitialPrompt) {
        setTimeout(() => {
          setShowPermissionModal(true);
          setHasShownInitialPrompt(true);
        }, 2000); // Show after 2 seconds on home page
      }
    }, [currentUser, checkPermissionStatus, hasShownInitialPrompt]),
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
    text: "text-blue-600",
  };

  const isStartNotification = currentNotification.subType === "start";

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-fade-in">
      <div
        className={`bg-white rounded-lg shadow-xl ${colorTheme.border} border-2 overflow-hidden`}
      >
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

        {isStartNotification &&
          currentNotification.menuItems &&
          currentNotification.menuItems.length > 0 && (
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <span
                  className={`${colorTheme.text} font-semibold text-xs uppercase tracking-wide`}
                >
                  Today's Menu
                </span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {currentNotification.menuItems.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className={`${colorTheme.text} text-xs mr-2 mt-0.5`}>
                      •
                    </span>
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

// NEW: Permission Modal Component
const PermissionModal = () => {
  const {
    showPermissionModal,
    handleAllowNotifications,
    handleDenyNotifications,
  } = useContext(NotificationContext);

  if (!showPermissionModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl border-4 border-white shadow-2xl max-w-sm w-full mx-auto transform animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center rounded-t-2xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Enable Notifications
          </h3>
          <p className="text-white text-sm opacity-90">
            Would you like to receive updates, alerts, and offers from Menu?
          </p>
        </div>

        {/* Buttons */}
        <div className="p-6 space-y-3">
          <button
            onClick={handleAllowNotifications}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Allow Notifications
          </button>

          <button
            onClick={handleDenyNotifications}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Don't Allow
          </button>
        </div>

        {/* Footer Note */}
        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-gray-500">
            You can change this later in Settings
          </p>
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
