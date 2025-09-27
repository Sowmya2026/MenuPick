import { useAuth } from '../context/AuthContext';
import { Shield, Calendar, Settings, Mail, Edit3, Key, Bell, Palette, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { currentUser, isDemoMode } = useAuth();
  
  // Animation variants
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
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 p-4 sm:p-6">
    <div className="p-3 sm:p-4 md:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6">
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

      {/* Profile Card */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 text-white">
          <div className="flex items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center mr-4 sm:mr-6 backdrop-blur-sm border-2 border-white/30">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">
                {currentUser?.email || 'User'}
              </h2>
              <div className="flex items-center mt-1 flex-wrap gap-2">
                <div className="flex items-center bg-white/20 px-2 py-1 rounded-full">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="text-xs sm:text-sm">{currentUser?.role || 'Administrator'}</span>
                </div>
                {isDemoMode && (
                  <span className="bg-amber-400/20 text-amber-200 text-xs px-2 py-1 rounded-full border border-amber-400/30">
                    Demo Mode
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Account Information */}
          <motion.div
            className="bg-green-50/50 rounded-xl p-4 sm:p-5 border border-green-200/50"
            variants={itemVariants}
            whileHover="hover"
          >
            <h3 className="font-medium text-green-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
              Account Information
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                <span className="font-medium text-green-800 text-sm sm:text-base">Email:</span>
                <span className="flex items-center text-green-700 text-xs sm:text-sm">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                  {currentUser?.email || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                <span className="font-medium text-green-800 text-sm sm:text-base">Status:</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-300">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-green-800 text-sm sm:text-base">Member since:</span>
                <span className="flex items-center text-green-700 text-xs sm:text-sm">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                  {currentUser?.joinDate || 'January 2023'}
                </span>
              </div>
            </div>
          </motion.div>
          
          {/* Preferences */}
          <motion.div
            className="bg-green-50/50 rounded-xl p-4 sm:p-5 border border-green-200/50"
            variants={itemVariants}
            whileHover="hover"
          >
            <h3 className="font-medium text-green-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
              Preferences
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                <span className="font-medium text-green-800 text-sm sm:text-base">Language:</span>
                <span className="text-green-700 text-xs sm:text-sm">English</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                <span className="font-medium text-green-800 text-sm sm:text-base">Notifications:</span>
                <span className="flex items-center text-green-700 text-xs sm:text-sm">
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
                  Enabled
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-green-800 text-sm sm:text-base">Theme:</span>
                <span className="text-green-700 text-xs sm:text-sm">Light</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Account Actions */}
        <motion.div
          className="border-t border-green-200/50 p-4 sm:p-6 bg-green-50/30"
          variants={itemVariants}
        >
          <h3 className="font-medium text-green-900 mb-3 sm:mb-4 text-base sm:text-lg">Account Actions</h3>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <motion.button
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center text-sm sm:text-base shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Edit Profile
            </motion.button>
            <motion.button
              className="px-4 py-2 sm:px-5 sm:py-2.5 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-all duration-200 flex items-center text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Key className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Change Password
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Stats Cards - Mobile Optimized */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-3 sm:p-4"
          variants={itemVariants}
          whileHover="hover"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-semibold text-green-900">Activity</h3>
            <div className="p-1 sm:p-2 bg-green-100 rounded-lg">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-bold text-green-900">28</p>
          <p className="text-xs text-green-700 mt-1">This month</p>
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-3 sm:p-4"
          variants={itemVariants}
          whileHover="hover"
        >
         <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-semibold text-green-900">Security</h3>
            <div className="p-1 sm:p-2 bg-amber-100 rounded-lg">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-bold text-green-900">100%</p>
          <p className="text-xs text-green-700 mt-1">Protected</p>
        </motion.div>

        
      </motion.div>
    </div>
    </div>
  );
};

export default Profile;