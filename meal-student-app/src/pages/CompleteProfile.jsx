import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { User, BookOpen, Check, ArrowLeft, Sparkles } from "lucide-react";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    studentId: "",
    messPreference: "veg",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Pre-fill email if coming from signup
    if (currentUser?.email && !formData.displayName) {
      // Extract name from email for convenience
      const nameFromEmail = currentUser.email.split('@')[0];
      setFormData(prev => ({
        ...prev,
        displayName: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
      }));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    // Name validation - only letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!formData.displayName.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (!nameRegex.test(formData.displayName)) {
      setError("Name can only contain letters and spaces");
      return false;
    }

    // Student ID validation - alphanumeric
    const studentIdRegex = /^[a-zA-Z0-9]+$/;
    if (!formData.studentId.trim()) {
      setError("Please enter your student ID");
      return false;
    }
    if (!studentIdRegex.test(formData.studentId)) {
      setError("Student ID can only contain letters and numbers");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await updateUserProfile({
        ...formData,
        displayName: formData.displayName.trim(),
        studentId: formData.studentId.trim().toUpperCase(),
        profileCompleted: true
      });
      
      if (result.success) {
        // Navigation will be handled by the auth state change
        // The user will be automatically redirected to home
        // because needsProfileCompletion will be set to false
      } else {
        setError(result.error || "Failed to complete profile");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const messOptions = [
    { id: "veg", name: "Veg", icon: "🌱", color: "green" },
    { id: "non-veg", name: "Non-Veg", icon: "🍗", color: "red" },
    { id: "special", name: "Special", icon: "⭐", color: "purple" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-purple-50 to-red-50">
      <div className="w-full max-w-md">
        {/* Decorative Top */}
        <div className="relative mb-2">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-green-200 rounded-full"></div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-green-300 rounded-full"></div>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl border-4 border-white shadow-2xl shadow-green-100/50 hover:shadow-green-200/70 transition-all duration-500 transform hover:-translate-y-1">
          {/* Header Section */}
          <div className="text-center pt-6 px-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-4 transition-colors duration-300"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </button>

            <div className="mx-auto w-16 h-16 mb-4 transform hover:scale-110 transition-transform duration-300">
              <img
                src="/logo.png"
                alt="MenuPick"
                className="w-full h-full object-contain drop-shadow-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            <div className="relative inline-block">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 via-purple-600 to-red-600 bg-clip-text text-transparent mb-1">
                Complete Profile
              </h2>
              <Sparkles
                size={16}
                className="absolute -top-1 -right-4 text-purple-500 animate-pulse"
              />
            </div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              Almost there! Just a few more details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 animate-shake">
                <p className="text-red-600 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            {/* User Email (Read-only) */}
            {currentUser?.email && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3">
                <p className="text-blue-600 text-sm text-center">
                  <strong>Email:</strong> {currentUser.email}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {/* Display Name */}
              <div className="group relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
                <input
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-100 rounded-2xl focus:border-green-300 focus:ring-2 focus:ring-green-100 transition-all duration-300 bg-white/80 disabled:opacity-50"
                  placeholder="Full name"
                  disabled={isLoading}
                  pattern="[a-zA-Z\s]+"
                  title="Name can only contain letters and spaces"
                />
              </div>

              {/* Student ID */}
              <div className="group relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors duration-300" />
                <input
                  name="studentId"
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-100 rounded-2xl focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-300 bg-white/80 disabled:opacity-50"
                  placeholder="Student ID"
                  disabled={isLoading}
                  pattern="[a-zA-Z0-9]+"
                  title="Student ID can only contain letters and numbers"
                />
              </div>
            </div>

            {/* Mess Preference */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
                Mess Preference
              </label>
              <div className="flex gap-2">
                {messOptions.map((option) => (
                  <label key={option.id} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="messPreference"
                      value={option.id}
                      checked={formData.messPreference === option.id}
                      onChange={handleInputChange}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div
                      className={`text-center py-3 px-2 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                        formData.messPreference === option.id
                          ? `border-${option.color}-300 bg-${option.color}-50 text-${option.color}-600 scale-105 shadow-sm`
                          : "border-gray-100 text-gray-500 hover:border-gray-200"
                      } ${isLoading ? "opacity-50" : ""}`}
                    >
                      <div className="text-lg mb-1">{option.icon}</div>
                      {option.name}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-semibold shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Completing Profile...
                </div>
              ) : (
                <>
                  <Check size={16} className="inline mr-2" />
                  Complete Profile
                </>
              )}
            </button>
          </form>
        </div>

        {/* Decorative Bottom */}
        <div className="relative mt-2">
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-purple-200 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;