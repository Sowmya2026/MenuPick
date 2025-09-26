import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useMeal } from "../context/MealContext";
import { useNotification } from "../context/NotificationContext";
import {
  User,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  Bell,
  Shield,
  HelpCircle,
  ArrowRight,
  Leaf,
  Beef,
  Star,
  BookOpen,
  Utensils,
  AlertCircle,
  Settings,
} from "lucide-react";

export default function Profile() {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const { preferences } = useMeal();
  const { 
    notifications, 
    updateNotificationPreference,
    hasPermission,
    permissionStatus,
    requestNotificationPermission,
    togglePushNotifications,
    checkPermissionStatus
  } = useNotification();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    studentId: "",
    dietaryPreferences: [],
    allergies: [],
    messPreference: "veg",
  });

  // Local state for toggle UI feedback
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        displayName: currentUser.displayName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        studentId: currentUser.studentId || "",
        dietaryPreferences: currentUser.dietaryPreferences || [],
        allergies: currentUser.allergies || [],
        messPreference: currentUser.messPreference || "veg",
      }));
    }
  }, [currentUser]);

  // Check permission status on component mount
  useEffect(() => {
    checkPermissionStatus();
  }, [checkPermissionStatus]);

  // Get color theme based on mess preference
  const getMessColorTheme = (messType = formData.messPreference) => {
    switch (messType) {
      case 'veg':
        return {
          primary: 'green',
          gradient: 'from-green-500 to-green-600',
          light: 'green-50',
          border: 'green-200',
          text: 'text-green-600',
          bg: 'bg-green-500'
        };
      case 'non-veg':
        return {
          primary: 'red',
          gradient: 'from-red-500 to-red-600',
          light: 'red-50',
          border: 'red-200',
          text: 'text-red-600',
          bg: 'bg-red-500'
        };
      case 'special':
        return {
          primary: 'purple',
          gradient: 'from-purple-500 to-purple-600',
          light: 'purple-50',
          border: 'purple-200',
          text: 'text-purple-600',
          bg: 'bg-purple-500'
        };
      default:
        return {
          primary: 'green',
          gradient: 'from-green-500 to-green-600',
          light: 'green-50',
          border: 'green-200',
          text: 'text-green-600',
          bg: 'bg-green-500'
        };
    }
  };

  const colorTheme = getMessColorTheme();

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Keto",
    "Paleo",
  ];

  const allergyOptions = [
    "Nuts",
    "Dairy",
    "Gluten",
    "Shellfish",
    "Eggs",
    "Soy",
  ];

  const messOptions = [
    { id: "veg", name: "Vegetarian", icon: <Leaf size={16} />, color: "green" },
    {
      id: "non-veg",
      name: "Non-Vegetarian",
      icon: <Beef size={16} />,
      color: "red",
    },
    {
      id: "special",
      name: "Special",
      icon: <Star size={16} />,
      color: "purple",
    },
  ];

  // Handle meal reminder toggle with proper error handling
  const handleMealReminderToggle = async (enabled) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // If enabling and push notifications are disabled, suggest enabling them
      if (enabled && !notifications.pushNotifications && permissionStatus !== 'denied') {
        // Allow meal reminders to be enabled without push notifications
        // User will get in-app notifications only
        updateNotificationPreference('mealReminders', enabled);
      } 
      // If enabling but push notifications are blocked
      else if (enabled && permissionStatus === 'denied') {
        // Still enable meal reminders for in-app notifications
        updateNotificationPreference('mealReminders', enabled);
      }
      else {
        // Simple toggle for meal reminders
        updateNotificationPreference('mealReminders', enabled);
      }
    } catch (error) {
      console.log('Error toggling meal reminders:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle push notification toggle with better error handling
  const handlePushNotificationToggle = async (enabled) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const success = await togglePushNotifications(enabled);
      
      // If toggling failed, revert the UI toggle
      if (!success && enabled) {
        // The toggle will remain off due to the async nature
        console.log('Push notification toggle was reverted due to permission issues');
      }
    } catch (error) {
      console.log('Error toggling push notifications:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Open browser settings guide
  const openBrowserSettingsGuide = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    let guideUrl = '';
    
    if (userAgent.includes('chrome')) {
      guideUrl = 'https://support.google.com/chrome/answer/3220216';
    } else if (userAgent.includes('firefox')) {
      guideUrl = 'https://support.mozilla.org/en-US/kb/push-notifications-firefox';
    } else if (userAgent.includes('safari')) {
      guideUrl = 'https://support.apple.com/guide/safari/manage-website-notifications-sfri40734/mac';
    } else {
      guideUrl = 'https://www.howtogeek.com/355088/how-to-enable-and-disable-web-notifications-in-chrome/';
    }
    
    window.open(guideUrl, '_blank');
  };

  const handleSave = async () => {
    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        console.log("Profile saved successfully:", formData);
        setIsEditing(false);
      } else {
        console.error("Error saving profile:", result.error);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        studentId: currentUser.studentId || "",
        dietaryPreferences: currentUser.dietaryPreferences || [],
        allergies: currentUser.allergies || [],
        messPreference: currentUser.messPreference || "veg",
      });
    }
    setIsEditing(false);
  };

  const toggleDietaryPreference = (preference) => {
    setFormData((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter((p) => p !== preference)
        : [...prev.dietaryPreferences, preference],
    }));
  };

  const toggleAllergy = (allergy) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy],
    }));
  };

  const setMessPreference = (preference) => {
    setFormData((prev) => ({
      ...prev,
      messPreference: preference,
    }));
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8 px-4 md:py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-3 md:text-2xl md:mb-4">
          Please Sign In
        </h2>
        <p className="text-gray-600 mb-4 text-sm md:text-base md:mb-6">
          You need to be signed in to view your profile.
        </p>
        <a href="/auth" className="btn-primary text-sm px-4 py-2 md:text-base">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 md:px-0 md:py-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Profile Settings</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base md:mt-2">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        {/* Left Column - Main Content */}
        <div className="md:col-span-2 space-y-4 md:space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center md:text-xl">
                <User size={18} className="mr-2 md:size-5" />
                Personal Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`flex items-center ${colorTheme.text} hover:text-${colorTheme.primary}-700 text-sm`}
                >
                  <Edit3 size={14} className="mr-1 md:size-4" />
                  Edit
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center text-green-600 hover:text-green-700 text-sm"
                  >
                    <Save size={14} className="mr-1 md:size-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center text-gray-600 hover:text-gray-700 text-sm"
                  >
                    <X size={14} className="mr-1 md:size-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 md:text-sm md:mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:cursor-not-allowed md:text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 md:text-sm md:mb-2">
                  Student ID
                </label>
                <div className="flex items-center">
                  <BookOpen size={14} className="text-gray-400 mr-2 md:size-4" />
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        studentId: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:cursor-not-allowed md:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 md:text-sm md:mb-2">
                  Email
                </label>
                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <Mail size={14} className="text-gray-400 mr-2 md:size-4" />
                  <span className="text-gray-600 text-sm md:text-base">{currentUser.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 md:text-sm md:mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:cursor-not-allowed md:text-base"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 md:text-sm md:mb-2">
                  Member Since
                </label>
                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <Calendar size={14} className="text-gray-400 mr-2 md:size-4" />
                  <span className="text-gray-600 text-sm md:text-base">
                    {new Date(
                      currentUser.metadata?.creationTime || new Date()
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 md:text-sm md:mb-2">
                  Account Type
                </label>
                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <Shield size={14} className="text-gray-400 mr-2 md:size-4" />
                  <span className="text-gray-600 text-sm capitalize md:text-base">
                    {currentUser.accountType || 'email'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mess Preference Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 md:text-xl md:mb-4">
              Mess Preference
            </h2>
            <p className="text-xs text-gray-600 mb-3 md:text-sm md:mb-4">
              Set your default mess type for the home page
            </p>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {messOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => isEditing && setMessPreference(option.id)}
                  disabled={!isEditing}
                  className={`p-2 rounded-lg border-2 flex flex-col items-center transition-colors md:p-3 ${
                    formData.messPreference === option.id
                      ? `border-${option.color}-500 bg-${option.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  } ${
                    !isEditing
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <span className={`text-${option.color}-600 mb-1`}>
                    {option.icon}
                  </span>
                  <span className="text-xs text-center md:text-sm">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Preferences Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 md:text-xl md:mb-4">
              Dietary Preferences
            </h2>
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 md:gap-3">
              {dietaryOptions.map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-colors text-xs md:text-sm md:p-3 ${
                    formData.dietaryPreferences.includes(option)
                      ? `border-${colorTheme.primary}-300 bg-${colorTheme.primary}-50`
                      : "border-gray-200 hover:border-gray-300"
                  } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.dietaryPreferences.includes(option)}
                    onChange={() => toggleDietaryPreference(option)}
                    disabled={!isEditing}
                    className={`rounded text-${colorTheme.primary}-600 focus:ring-${colorTheme.primary}-500 mr-2`}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Allergies Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 md:text-xl md:mb-4">
              Allergies
            </h2>
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 md:gap-3">
              {allergyOptions.map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-colors text-xs md:text-sm md:p-3 ${
                    formData.allergies.includes(option)
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.allergies.includes(option)}
                    onChange={() => toggleAllergy(option)}
                    disabled={!isEditing}
                    className="rounded text-red-600 focus:ring-red-500 mr-2"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

       {/* Right Column - Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Notifications Card - UPDATED */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center md:text-xl md:mb-4">
              <Bell size={18} className="mr-2 md:size-5" />
              Notifications
            </h2>
            <div className="space-y-4">
              {/* Meal Reminder Toggle - FIXED */}
              <div className="border-b border-gray-100 pb-3">
                <label className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Utensils size={16} className="text-green-600 mr-2" />
                    <span className="text-xs font-medium text-gray-700 md:text-sm">
                      Meal Reminders
                    </span>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.mealReminders}
                      onChange={(e) => handleMealReminderToggle(e.target.checked)}
                      disabled={isProcessing}
                      className="sr-only peer"
                    />
                    <div className={`w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600 md:w-11 md:h-6 ${isProcessing ? 'opacity-50' : ''}`}></div>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  15min before start, 30min before end
                </p>
                {!notifications.mealReminders && (
                  <div className="flex items-center mt-1 text-xs text-amber-600">
                    <AlertCircle size={12} className="mr-1" />
                    Meal reminders are disabled
                  </div>
                )}
              </div>

              {/* Push Notifications Toggle - FIXED */}
              <div className="border-b border-gray-100 pb-3">
                <label className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell size={16} className="text-blue-600 mr-2" />
                    <span className="text-xs font-medium text-gray-700 md:text-sm">
                      Push Notifications
                    </span>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications && hasPermission}
                      onChange={(e) => handlePushNotificationToggle(e.target.checked)}
                      disabled={isProcessing || permissionStatus === 'denied'}
                      className="sr-only peer"
                    />
                    <div className={`w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 md:w-11 md:h-6 ${isProcessing || permissionStatus === 'denied' ? 'opacity-50' : ''}`}></div>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Receive notifications when app is closed
                </p>
                {permissionStatus === 'denied' && (
                  <div className="flex items-center mt-1 text-xs text-red-600">
                    <AlertCircle size={12} className="mr-1" />
                    <button 
                      onClick={openBrowserSettingsGuide}
                      className="underline hover:no-underline"
                    >
                      Enable in browser settings
                    </button>
                  </div>
                )}
              </div>

              {/* Other Notification Toggles */}
              {Object.entries(notifications)
                .filter(([key]) => key !== 'mealReminders' && key !== 'pushNotifications')
                .map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 capitalize md:text-sm">
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateNotificationPreference(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 md:w-11 md:h-6"></div>
                    </div>
                  </label>
                ))}
            </div>
          </div>

          {/* Notification Status Card - IMPROVED */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center md:text-xl md:mb-4">
              <Settings size={18} className="mr-2 md:size-5" />
              Notification Status
            </h2>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Meal Reminders</span>
                <span className={`font-medium ${notifications.mealReminders ? 'text-green-600' : 'text-red-600'}`}>
                  {notifications.mealReminders ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Push Notifications</span>
                <span className={`font-medium ${notifications.pushNotifications && hasPermission ? 'text-green-600' : 'text-red-600'}`}>
                  {notifications.pushNotifications && hasPermission ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Browser Permission</span>
                <span className={`font-medium ${
                  permissionStatus === 'granted' ? 'text-green-600' : 
                  permissionStatus === 'denied' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {permissionStatus === 'granted' ? 'Granted' : 
                   permissionStatus === 'denied' ? 'Blocked' : 'Not Set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Notification Type</span>
                <span className="font-medium text-blue-600">
                  {hasPermission ? 'Push + In-app' : 'In-app Only'}
                </span>
              </div>
            </div>
            
            {permissionStatus === 'denied' && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-800 mb-2">
                  🔔 Notifications are blocked in your browser settings.
                </p>
                <button 
                  onClick={openBrowserSettingsGuide}
                  className="text-xs text-red-700 underline hover:no-underline"
                >
                  Learn how to enable them
                </button>
              </div>
            )}
            
            {notifications.mealReminders && !hasPermission && permissionStatus !== 'denied' && (
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 Enable push notifications to get reminders when the app is closed.
                </p>
              </div>
            )}
          </div>

          {/* Account Stats Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 md:text-xl md:mb-4">
              Account Stats
            </h2>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-600">Student ID</span>
                <span className="font-medium">{formData.studentId || 'Not set'}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-600">Mess Preference</span>
                <span className="font-medium capitalize">
                  {formData.messPreference}
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-600">Meals Rated</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-600">Preferences Set</span>
                <span className="font-medium">
                  {(preferences || []).length}/10
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">
                  {new Date(
                    currentUser.metadata?.creationTime || new Date()
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 md:text-xl md:mb-4">
              Actions
            </h2>
            <div className="space-y-2 md:space-y-3">
              <button className="w-full flex items-center justify-between p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-xs md:text-sm md:p-3">
                <span className="flex items-center">
                  <Shield size={14} className="mr-2 md:size-4" />
                  Privacy & Security
                </span>
                <ArrowRight size={14} className="md:size-4" />
              </button>

              <button className="w-full flex items-center justify-between p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-xs md:text-sm md:p-3">
                <span className="flex items-center">
                  <HelpCircle size={14} className="mr-2 md:size-4" />
                  Help & Support
                </span>
                <ArrowRight size={14} className="md:size-4" />
              </button>

              <button
                onClick={logout}
                className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs md:text-sm md:p-3"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}