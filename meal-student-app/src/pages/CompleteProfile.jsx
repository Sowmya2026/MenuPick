import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import {
  User,
  Phone,
  MapPin,
  Home,
  Leaf,
  Beef,
  Star,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

const CompleteProfile = () => {
  const { theme } = useTheme();
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    phone: "",
    hostel: "",
    room: "",
    messPreference: "veg",
  });

  const messTypes = [
    {
      id: "veg",
      name: "Vegetarian",
      icon: Leaf,
      description: "Pure veg meals",
    },
    {
      id: "non-veg",
      name: "Non-Veg",
      icon: Beef,
      description: "Includes non-veg",
    },
    {
      id: "special",
      name: "Special",
      icon: Star,
      description: "Special diet",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateUserProfile({
        ...formData,
        profileCompleted: true,
      });

      navigate("/");
    } catch (error) {
      console.error("Error completing profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: theme.colors.background }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div
          className="rounded-3xl p-6 sm:p-8 shadow-2xl"
          style={{
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" withText={true} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: theme.colors.text }}>
              Complete Your Profile
            </h2>
            <p className="text-sm sm:text-base" style={{ color: theme.colors.textSecondary }}>
              Just a few more details to get started
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.colors.textTertiary }} />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl border-2"
                  style={{
                    background: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }}
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.colors.textTertiary }} />
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl border-2"
                  style={{
                    background: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            {/* Hostel & Room */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                  Hostel
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.colors.textTertiary }} />
                  <input
                    name="hostel"
                    type="text"
                    required
                    value={formData.hostel}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl border-2"
                    style={{
                      background: theme.colors.backgroundSecondary,
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    }}
                    placeholder="Hostel A"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                  Room Number
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.colors.textTertiary }} />
                  <input
                    name="room"
                    type="text"
                    required
                    value={formData.room}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl border-2"
                    style={{
                      background: theme.colors.backgroundSecondary,
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    }}
                    placeholder="101"
                  />
                </div>
              </div>
            </div>

            {/* Mess Preference */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: theme.colors.text }}>
                Mess Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {messTypes.map((mess) => {
                  const MessIcon = mess.icon;
                  const isSelected = formData.messPreference === mess.id;

                  return (
                    <button
                      key={mess.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, messPreference: mess.id })}
                      className="p-4 rounded-xl text-left transition-all"
                      style={{
                        background: isSelected ? `${theme.colors.primary}20` : theme.colors.backgroundSecondary,
                        border: `2px solid ${isSelected ? theme.colors.primary : theme.colors.border}`,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            background: isSelected ? theme.colors.primary : theme.colors.backgroundTertiary,
                          }}
                        >
                          <MessIcon className="w-5 h-5" style={{ color: isSelected ? 'white' : theme.colors.primary }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm" style={{ color: theme.colors.text }}>
                            {mess.name}
                          </div>
                          <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                            {mess.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-4 px-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background: theme.colors.primary,
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  Complete Profile
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: theme.colors.textTertiary }}>
          You can update these details anytime from your profile
        </p>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;