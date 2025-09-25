import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, BookOpen, Check, ArrowLeft } from "lucide-react";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    studentId: "",
    messPreference: "veg",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentUser, updateUserProfile, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.displayName) {
      setFormData(prev => ({
        ...prev,
        displayName: currentUser.displayName || ""
      }));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      clearError();
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.displayName.trim() || !formData.studentId.trim()) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        navigate("/");
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
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl border-4 border-white shadow-2xl shadow-green-100/50 p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
              Complete Your Profile
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Please provide some additional information to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Display Name */}
            <div className="group relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="displayName"
                type="text"
                required
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-100 rounded-2xl focus:border-green-300 focus:ring-2 focus:ring-green-100 transition-all duration-300"
                placeholder="Full name"
                disabled={isLoading}
              />
            </div>

            {/* Student ID */}
            <div className="group relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="studentId"
                type="text"
                required
                value={formData.studentId}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-100 rounded-2xl focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-300"
                placeholder="Student ID"
                disabled={isLoading}
              />
            </div>

            {/* Mess Preference */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
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
                      }`}
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
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-semibold shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-300 disabled:opacity-50"
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
      </div>
    </div>
  );
};

export default CompleteProfile;