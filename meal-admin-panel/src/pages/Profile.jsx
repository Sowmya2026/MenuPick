import { useAuth } from '../context/AuthContext';
import { Shield, Calendar, Settings, Mail, Edit3, Key, Bell, Palette } from 'lucide-react';

const Profile = () => {
  const { currentUser, isDemoMode } = useAuth();
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-800 pb-4">User Profile</h1>
      
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6 text-white">
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mr-6 backdrop-blur-sm border-2 border-white/30">
              <span className="text-3xl font-bold text-white">
                {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{currentUser?.email || 'User'}</h2>
              <div className="flex items-center mt-1">
                <Shield className="h-4 w-4 mr-1" />
                <span>{currentUser?.role || 'Administrator'}</span>
                {isDemoMode && (
                  <span className="ml-3 bg-amber-400/20 text-amber-200 text-xs px-2 py-1 rounded-full border border-amber-400/30">
                    Demo Mode
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Information */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-medium text-gray-700 mb-4 text-lg flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary-600" />
              Account Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-600">Email:</span>
                <span className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {currentUser?.email || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-600">Status:</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-600">Member since:</span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {currentUser?.joinDate || 'January 2023'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Preferences */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-medium text-gray-700 mb-4 text-lg flex items-center">
              <Palette className="h-5 w-5 mr-2 text-primary-600" />
              Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-600">Language:</span>
                <span>English</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-600">Notifications:</span>
                <span className="flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-gray-400" />
                  Enabled
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-600">Theme:</span>
                <span>Light</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="font-medium text-gray-700 mb-4 text-lg">Account Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
            <button className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center">
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;