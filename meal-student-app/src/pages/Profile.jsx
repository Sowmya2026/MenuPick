import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useMeal } from "../context/MealContext";
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
} from "lucide-react";

export default function Profile() {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const { preferences } = useMeal();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    dietaryPreferences: [],
    allergies: [],
    messPreference: "veg", // Add mess preference to form data
  });
  const [notifications, setNotifications] = useState({
    mealReminders: true,
    preferenceUpdates: true,
    specialOffers: false,
    monthlyReports: true,
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        displayName: currentUser.displayName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        dietaryPreferences: currentUser.dietaryPreferences || [],
        allergies: currentUser.allergies || [],
        messPreference: currentUser.messPreference || "veg",
      }));
    }
  }, [currentUser]);

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
      color: "yellow",
    },
  ];

  const handleSave = async () => {
    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        console.log("Profile saved successfully:", formData);
        setIsEditing(false);
        // Show success message
      } else {
        console.error("Error saving profile:", result.error);
        // Show error message
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    // Reset form data
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
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

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Please Sign In
        </h2>
        <p className="text-gray-600 mb-6">
          You need to be signed in to view your profile.
        </p>
        <a href="/auth" className="btn-primary">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User size={20} className="mr-2" />
                Personal Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit3 size={16} className="mr-1" />
                  Edit
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center text-green-600 hover:text-green-700"
                  >
                    <Save size={16} className="mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center text-gray-600 hover:text-gray-700"
                  >
                    <X size={16} className="mr-1" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="input-field disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center">
                  <Mail size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">{currentUser.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  disabled={!isEditing}
                  className="input-field disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {new Date(
                      currentUser.metadata.creationTime
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mess Preference Card */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mess Preference
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Set your default mess type for the home page
            </p>
            <div className="grid grid-cols-3 gap-3">
              {messOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => isEditing && setMessPreference(option.id)}
                  disabled={!isEditing}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center transition-colors ${
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
                  <span className="text-sm">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Preferences Card */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Dietary Preferences
            </h2>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
              {dietaryOptions.map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.dietaryPreferences.includes(option)
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.dietaryPreferences.includes(option)}
                    onChange={() => toggleDietaryPreference(option)}
                    disabled={!isEditing}
                    className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Allergies Card */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Allergies
            </h2>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
              {allergyOptions.map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
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
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notifications Card */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Bell size={20} className="mr-2" />
              Notifications
            </h2>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => toggleNotification(key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Account Stats Card */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Meals Rated</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Preferences Set</span>
                <span className="font-medium">
                  {(preferences || []).length}/10
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">
                  {new Date(
                    currentUser.metadata.creationTime
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Default Mess</span>
                <span className="font-medium capitalize">
                  {formData.messPreference}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="flex items-center">
                  <Shield size={16} className="mr-2" />
                  Privacy & Security
                </span>
                <ArrowRight size={16} />
              </button>

              <button className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="flex items-center">
                  <HelpCircle size={16} className="mr-2" />
                  Help & Support
                </span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={logout}
                className="w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
