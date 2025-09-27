import { useAuth } from "../context/AuthContext";
import {
  Shield,
  Calendar,
  Settings,
  Mail,
  Edit3,
  Key,
  Bell,
  Palette,
  User,
  Activity,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const { currentUser, isDemoMode } = useAuth();

  // Animation variants matching dashboard
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 p-4 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900">
                User Profile
              </h1>
              <p className="text-xs sm:text-sm text-green-700 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </motion.div>
        </div>

        {/* Profile Card - Full Width */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-4 sm:p-6"
          variants={itemVariants}
          whileHover="hover"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-green-900 text-lg sm:text-xl truncate">
                {currentUser?.email || "User"}
              </h2>
              <div className="flex items-center mt-1 flex-wrap gap-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {currentUser?.role || "Administrator"}
                </span>
                {isDemoMode && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                    Demo Mode
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-green-900">
                28
              </p>
              <p className="text-xs sm:text-sm text-green-700">Activities</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-green-900">
                100%
              </p>
              <p className="text-xs sm:text-sm text-green-700">Security</p>
            </div>
          </div>
        </motion.div>

        {/* Activity & Security Cards - Single Row */}
        <motion.div
          className="grid grid-cols-2 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Activity Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-4 sm:p-6"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-900 text-sm sm:text-base">
                Activity
              </h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-900 mb-2">
              28
            </p>
            <p className="text-xs sm:text-sm text-green-700">This month</p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
          </motion.div>

          {/* Security Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-4 sm:p-6"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-900 text-sm sm:text-base">
                Security
              </h3>
              <div className="p-2 bg-amber-100 rounded-lg">
                <Lock className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-900 mb-2">
              100%
            </p>
            <p className="text-xs sm:text-sm text-green-700">Protected</p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-amber-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.7, duration: 1 }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Account Details Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Account Information */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-4 sm:p-6"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center mb-4">
              <Settings className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-900 text-lg">
                Account Information
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                <span className="text-sm font-medium text-green-800">
                  Email
                </span>
                <span className="flex items-center text-green-700 text-sm">
                  <Mail className="h-4 w-4 mr-2 text-green-500" />
                  {currentUser?.email || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                <span className="text-sm font-medium text-green-800">Role</span>
                <span className="text-green-700 text-sm">
                  {currentUser?.role || "Administrator"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-green-800">
                  Join Date
                </span>
                <span className="flex items-center text-green-700 text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-green-500" />
                  {currentUser?.joinDate || "January 2023"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-4 sm:p-6"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center mb-4">
              <Palette className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-900 text-lg">
                Preferences
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                <span className="text-sm font-medium text-green-800">
                  Language
                </span>
                <span className="text-green-700 text-sm">English</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                <span className="text-sm font-medium text-green-800">
                  Notifications
                </span>
                <span className="flex items-center text-green-700 text-sm">
                  <Bell className="h-4 w-4 mr-2 text-green-500" />
                  Enabled
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-green-800">
                  Theme
                </span>
                <span className="text-green-700 text-sm">Light</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions - Matching Dashboard Style */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="border-b border-green-200/30 px-4 sm:px-6 py-3">
            <h2 className="text-base sm:text-lg font-semibold text-green-900">
              Account Actions
            </h2>
            <p className="text-green-600 text-xs sm:text-sm mt-1">
              Manage your account settings
            </p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-md">
              <motion.button
                className="flex items-center justify-center p-3 sm:p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Edit3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="text-sm sm:text-base font-medium">
                  Edit Profile
                </span>
              </motion.button>

              <motion.button
                className="flex items-center justify-center p-3 sm:p-4 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-all duration-200"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Key className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="text-sm sm:text-base font-medium">
                  Change Password
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
