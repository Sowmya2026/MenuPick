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
  ChefHat,
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
    checkPermissionStatus,
  } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    studentId: "",
    dietaryPreferences: [],
    allergies: [],
    // messPreference will be set from currentUser and cannot be changed
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
        // messPreference is read-only from currentUser
      }));
    }
  }, [currentUser]);

  // Check permission status on component mount
  useEffect(() => {
    checkPermissionStatus();
  }, [checkPermissionStatus]);

  // Get gradient class for header based on mess type
  const getHeaderGradient = () => {
    const messType = currentUser?.messPreference || "veg";
    switch (messType) {
      case "veg":
        return "bg-gradient-to-r from-green-600 to-green-800";
      case "non-veg":
        return "bg-gradient-to-r from-red-600 to-red-800";
      case "special":
        return "bg-gradient-to-r from-purple-600 to-purple-800";
      default:
        return "bg-gradient-to-r from-green-600 to-purple-600";
    }
  };

  // Get color class based on mess type
  const getColorClass = () => {
    const messType = currentUser?.messPreference || "veg";
    switch (messType) {
      case "veg":
        return "text-green-600";
      case "non-veg":
        return "text-red-600";
      case "special":
        return "text-purple-600";
      default:
        return "text-gray-800";
    }
  };

  // Get mess icon
  const getMessIcon = () => {
    const messType = currentUser?.messPreference || "veg";
    switch (messType) {
      case "veg":
        return <Leaf size={20} className="text-green-600" />;
      case "non-veg":
        return <Beef size={20} className="text-red-600" />;
      case "special":
        return <Star size={20} className="text-purple-600" />;
      default:
        return <Leaf size={20} className="text-green-600" />;
    }
  };

  // Get mess type display name
  const getMessTypeDisplayName = () => {
    const messType = currentUser?.messPreference || "veg";
    switch (messType) {
      case "veg":
        return "Vegetarian";
      case "non-veg":
        return "Non-Vegetarian";
      case "special":
        return "Special";
      default:
        return "Vegetarian";
    }
  };

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

  // Remove messOptions array since users can't change mess preference

  // Handle meal reminder toggle with proper error handling
  const handleMealReminderToggle = async (enabled) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      // If enabling and push notifications are disabled, suggest enabling them
      if (
        enabled &&
        !notifications.pushNotifications &&
        permissionStatus !== "denied"
      ) {
        // Allow meal reminders to be enabled without push notifications
        // User will get in-app notifications only
        updateNotificationPreference("mealReminders", enabled);
      }
      // If enabling but push notifications are blocked
      else if (enabled && permissionStatus === "denied") {
        // Still enable meal reminders for in-app notifications
        updateNotificationPreference("mealReminders", enabled);
      } else {
        // Simple toggle for meal reminders
        updateNotificationPreference("mealReminders", enabled);
      }
    } catch (error) {
      console.log("Error toggling meal reminders:", error);
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
        console.log(
          "Push notification toggle was reverted due to permission issues"
        );
      }
    } catch (error) {
      console.log("Error toggling push notifications:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Open browser settings guide
  const openBrowserSettingsGuide = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    let guideUrl = "";

    if (userAgent.includes("chrome")) {
      guideUrl = "https://support.google.com/chrome/answer/3220216";
    } else if (userAgent.includes("firefox")) {
      guideUrl =
        "https://support.mozilla.org/en-US/kb/push-notifications-firefox";
    } else if (userAgent.includes("safari")) {
      guideUrl =
        "https://support.apple.com/guide/safari/manage-website-notifications-sfri40734/mac";
    } else {
      guideUrl =
        "https://www.howtogeek.com/355088/how-to-enable-and-disable-web-notifications-in-chrome/";
    }

    window.open(guideUrl, "_blank");
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
        // messPreference remains read-only
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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="px-2 py-2 sm:px-4 sm:py-5 md:px-4 md:py-6">
        <div className="text-center">
          <h1
            className={`text-2xl font-bold bg-clip-text text-transparent font-serif sm:text-3xl md:text-4xl ${getHeaderGradient()} mb-[0px] sm:mb-3 md:mb-[0px]`}
          >
            Profile Settings
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 pb-4 sm:px-4 sm:pb-6 md:px-6 md:pb-8">
        {/* Mess Type Header */}
        <div className="flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
          <div className="flex items-center mr-2 sm:mr-3">{getMessIcon()}</div>
          <h2
            className={`text-lg font-semibold font-serif sm:text-xl md:text-2xl ${getColorClass()}`}
          >
            Manage Your Account
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
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
                      className={`flex items-center ${getColorClass()} hover:opacity-80 text-sm`}
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

                <div className="space-y-3 sm:space-y-4">
                  {/* First Row: Display Name and Student ID */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {/* Display Name */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Student ID */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700">
                        Student ID
                      </label>
                      <div className="relative">
                        <BookOpen
                          size={14}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
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
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Second Row: Email */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Email
                    </label>
                    <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[42px]">
                      <Mail
                        size={14}
                        className="text-gray-400 mr-2 flex-shrink-0"
                      />
                      <span className="text-gray-600 text-sm truncate">
                        {currentUser.email}
                      </span>
                    </div>
                  </div>

                  {/* Third Row: Phone Number, Member Since, Account Type */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-[13px] disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    {/* Member Since */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700">
                        Member Since
                      </label>
                      <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[42px]">
                        <span className="text-gray-600 text-[12px]">
                          {new Date(
                            currentUser.metadata?.creationTime || new Date()
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Account Type */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700">
                        Account Type
                      </label>
                      <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[42px]">
                        <Shield
                          size={14}
                          className="text-gray-400 mr-2 flex-shrink-0"
                        />
                        <span className="text-gray-600 text-sm capitalize">
                          {currentUser.accountType || "email"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mess Information Card - Read Only */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 md:text-xl md:mb-4">
                  Mess Information
                </h2>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    {getMessIcon()}
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {getMessTypeDisplayName()} Mess
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                    Assigned
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Your mess type is assigned by the administration and cannot be
                  changed.
                </p>
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
                          ? `border-${getColorClass().split("-")[1]}-300 bg-${
                              getColorClass().split("-")[1]
                            }-50`
                          : "border-gray-200 hover:border-gray-300"
                      } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.dietaryPreferences.includes(option)}
                        onChange={() => toggleDietaryPreference(option)}
                        disabled={!isEditing}
                        className={`rounded ${getColorClass()} focus:ring-${
                          getColorClass().split("-")[1]
                        }-500 mr-2`}
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
              {/* Notifications Card */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center md:text-xl md:mb-4">
                  <Bell size={18} className="mr-2 md:size-5" />
                  Notifications
                </h2>
                <div className="space-y-4">
                  {/* Meal Reminder Toggle */}
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
                          onChange={(e) =>
                            handleMealReminderToggle(e.target.checked)
                          }
                          disabled={isProcessing}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600 md:w-11 md:h-6 ${
                            isProcessing ? "opacity-50" : ""
                          }`}
                        ></div>
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
                
                  {/* Push Notifications Toggle */}
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
                          checked={
                            notifications.pushNotifications && hasPermission
                          }
                          onChange={(e) =>
                            handlePushNotificationToggle(e.target.checked)
                          }
                          disabled={
                            isProcessing || permissionStatus === "denied"
                          }
                          className="sr-only peer"
                        />
                        <div
                          className={`w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 md:w-11 md:h-6 ${
                            isProcessing || permissionStatus === "denied"
                              ? "opacity-50"
                              : ""
                          }`}
                        ></div>
                      </div>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Receive notifications when app is closed
                    </p>
                    {permissionStatus === "denied" && (
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
                    .filter(
                      ([key]) =>
                        key !== "mealReminders" && key !== "pushNotifications"
                    )
                    .map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs text-gray-700 capitalize md:text-sm">
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </span>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              updateNotificationPreference(
                                key,
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 md:w-11 md:h-6"></div>
                        </div>
                      </label>
                    ))}
                </div>
              </div>

              {/* Notification Status Card */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center md:text-xl md:mb-4">
                  <Settings size={18} className="mr-2 md:size-5" />
                  Notification Status
                </h2>
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meal Reminders</span>
                    <span
                      className={`font-medium ${
                        notifications.mealReminders
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {notifications.mealReminders ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Push Notifications</span>
                    <span
                      className={`font-medium ${
                        notifications.pushNotifications && hasPermission
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {notifications.pushNotifications && hasPermission
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Browser Permission</span>
                    <span
                      className={`font-medium ${
                        permissionStatus === "granted"
                          ? "text-green-600"
                          : permissionStatus === "denied"
                          ? "text-red-600"
                          : "text-amber-600"
                      }`}
                    >
                      {permissionStatus === "granted"
                        ? "Granted"
                        : permissionStatus === "denied"
                        ? "Blocked"
                        : "Not Set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notification Type</span>
                    <span className="font-medium text-blue-600">
                      {hasPermission ? "Push + In-app" : "In-app Only"}
                    </span>
                  </div>
                </div>

                {permissionStatus === "denied" && (
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

                {notifications.mealReminders &&
                  !hasPermission &&
                  permissionStatus !== "denied" && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        💡 Enable push notifications to get reminders when the
                        app is closed.
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
                    <span className="font-medium">
                      {formData.studentId || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Mess Type</span>
                    <span className="font-medium capitalize">
                      {getMessTypeDisplayName()}
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
      </div>
    </div>
  );
}
