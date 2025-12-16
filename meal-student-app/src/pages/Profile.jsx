import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { showLogoutConfirmation } from '../utils/alertUtils';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  LogOut,
  Settings,

  ArrowRight,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const { theme, changeTheme, themes, currentTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  // Use refs to prevent re-renders
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const hostelRef = useRef(null);
  const roomRef = useRef(null);

  // Initialize refs with current user data
  useEffect(() => {
    if (currentUser && nameRef.current) {
      nameRef.current.value = currentUser.name || '';
      phoneRef.current.value = currentUser.phone || '';
      hostelRef.current.value = currentUser.hostel || '';
      roomRef.current.value = currentUser.room || '';
    }
  }, [currentUser?.uid]);

  const handleSave = async () => {
    try {
      await updateUserProfile({
        name: nameRef.current?.value || '',
        phone: phoneRef.current?.value || '',
        hostel: hostelRef.current?.value || '',
        room: roomRef.current?.value || '',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (currentUser) {
      nameRef.current.value = currentUser.name || '';
      phoneRef.current.value = currentUser.phone || '';
      hostelRef.current.value = currentUser.hostel || '';
      roomRef.current.value = currentUser.room || '';
    }
    setIsEditing(false);
  };

  const handleLogout = async () => {
    const result = await showLogoutConfirmation();
    if (result.isConfirmed) {
      try {
        await logout();
      } catch (error) {
        toast.error('Error logging out');
      }
    }
  };



  const InfoField = ({ icon: Icon, label, inputRef, editable = true, defaultValue = '' }) => (
    <div
      className="p-3 sm:p-4 rounded-xl"
      style={{ background: theme.colors.backgroundSecondary }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: theme.colors.backgroundTertiary }}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.colors.primary }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs mb-1" style={{ color: theme.colors.textSecondary }}>
            {label}
          </div>
          {isEditing && editable ? (
            <input
              ref={inputRef}
              type="text"
              defaultValue={defaultValue}
              className="w-full px-2 sm:px-3 py-1 rounded-lg border-2 transition-all text-sm font-medium"
              style={{
                background: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              }}
            />
          ) : (
            <div className="font-medium text-sm sm:text-base truncate" style={{ color: theme.colors.text }}>
              {defaultValue || 'Not set'}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-20" style={{ background: theme.colors.background }}>
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
        }}
      >
        <div className="relative px-4 sm:px-6 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Profile Avatar */}
            <div className="relative inline-block mb-3 sm:mb-4">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto border-4 border-white shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.primary})`,
                  color: 'white',
                }}
              >
                {(currentUser?.name || currentUser?.email || 'U').charAt(0).toUpperCase()}
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
                  style={{ color: theme.colors.primary }}
                >
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>

            {/* Name */}
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 px-4">
              {currentUser?.name || 'Student'}
            </h1>
            <p className="text-white/80 text-xs sm:text-sm px-4 truncate">
              {currentUser?.email}
            </p>

            {/* Mess Preference Badge */}
            <div className="mt-3 sm:mt-4">
              <div
                className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                }}
              >
                {currentUser?.messPreference?.toUpperCase() || 'NOT SET'} Mess
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">


        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl sm:rounded-2xl p-4 sm:p-6"
          style={{
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold" style={{ color: theme.colors.text }}>
              Personal Information
            </h2>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-white font-medium text-xs sm:text-sm"
                  style={{ background: theme.colors.primary }}
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 font-medium text-xs sm:text-sm"
                  style={{
                    background: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                  }}
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 font-medium text-xs sm:text-sm"
                style={{
                  background: theme.colors.backgroundTertiary,
                  color: theme.colors.primary,
                }}
              >
                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:gap-4">
            <InfoField
              icon={User}
              label="Full Name"
              inputRef={nameRef}
              defaultValue={currentUser?.name || ''}
            />
            <InfoField
              icon={Mail}
              label="Email Address"
              defaultValue={currentUser?.email || ''}
              editable={false}
            />
            <InfoField
              icon={Phone}
              label="Phone Number"
              inputRef={phoneRef}
              defaultValue={currentUser?.phone || ''}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InfoField
                icon={MapPin}
                label="Hostel"
                inputRef={hostelRef}
                defaultValue={currentUser?.hostel || ''}
              />
              <InfoField
                icon={MapPin}
                label="Room No."
                inputRef={roomRef}
                defaultValue={currentUser?.room || ''}
              />
            </div>
            <InfoField
              icon={Calendar}
              label="Member Since"
              defaultValue={new Date(currentUser?.createdAt?.toDate?.() || Date.now()).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
              editable={false}
            />
          </div>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl sm:rounded-2xl p-4 sm:p-6"
          style={{
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold" style={{ color: theme.colors.text }}>
                Appearance
              </h2>
              <p className="text-xs sm:text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
                Current theme: {themes[currentTheme]?.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => window.location.href = '/themes'}
            className="w-full p-3 sm:p-4 rounded-xl flex items-center justify-between transition-all"
            style={{
              background: theme.colors.backgroundSecondary,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base" style={{ color: theme.colors.text }}>
                  Change Theme
                </div>
                <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                  Choose from 16 premium themes
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
          </button>
        </motion.div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleLogout}
          className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm sm:text-base text-white"
          style={{
            background: '#EF4444',
          }}
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default Profile;
