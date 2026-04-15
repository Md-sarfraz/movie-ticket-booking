import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Camera,
  Lock,
  Save,
  Edit
} from 'lucide-react';
import { getAdminProfile, updateAdminProfile, updatePassword, uploadAvatar } from '../../../services/admin-profile-service';
import { getStoredAuth, setStoredAuth } from '../../../auth/storage';

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    role: '',
    dob: '',
    image: 'https://ui-avatars.com/api/?name=Admin+User&size=200&background=DC2626&color=fff'
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [lastLogin, setLastLogin] = useState('');

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      const userStr = localStorage.getItem('user');
      console.log('📦 Raw user from localStorage:', userStr);
      
      if (!userStr) {
        console.error('❌ No user found in localStorage');
        // Try to get from stored login data - check all possible keys
        console.log('🔍 Checking all localStorage keys:', Object.keys(localStorage));
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        console.log('🔑 Token exists:', !!token);
        console.log('👤 Role:', role);
        return null;
      }
      
      const user = JSON.parse(userStr);
      console.log('👤 Parsed user object:', user);
      console.log('🆔 User ID:', user?.id);
      
      // Also try to pre-populate form with existing data
      if (user && !profileData.email) {
        console.log('📝 Pre-populating form with localStorage data');
        setProfileData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phoneNo: user.phoneNo || '',
          role: user.role || 'ADMIN',
          dob: user.dob || '',
          image: user.image || `https://ui-avatars.com/api/?name=${user.firstName || 'Admin'}+${user.lastName || 'User'}&size=200&background=DC2626&color=fff`
        });
      }
      
      return user?.id;
    } catch (error) {
      console.error('❌ Error parsing user from localStorage:', error);
      return null;
    }
  };

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      
      if (!userId) {
        setError('User not logged in. Please login again.');
        setLoading(false);
        return;
      }
      
      console.log('🔍 Fetching profile for user ID:', userId);
      const response = await getAdminProfile(userId);
      console.log('📥 Profile response:', response);
      
      if (response.success) {
        const user = response.data;
        console.log('✅ User data received:', user);
        setProfileData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phoneNo: user.phoneNo || '',
          role: user.role || 'ADMIN',
          dob: user.dob || '',
          image: user.image || `https://ui-avatars.com/api/?name=${user.firstName || 'Admin'}+${user.lastName || 'User'}&size=200&background=DC2626&color=fff`
        });
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      setError(error.response?.data?.message || 'Failed to load profile data');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const userId = getUserId();
      const response = await updateAdminProfile(userId, profileData);
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
        // Update user in localStorage
        const { token, role, user } = getStoredAuth();
        if (token && role && user) {
          setStoredAuth({ token, role, user: { ...user, ...response.data } });
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    setSuccess('');
    setError('');

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setError('All password fields are required');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New password and confirm password do not match');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const userId = getUserId();
      if (!userId) {
        setError('Unable to identify user. Please login again.');
        setTimeout(() => setError(''), 3000);
        return;
      }

      setIsPasswordUpdating(true);
      console.log('🔐 Triggering password update for userId:', userId);

      const response = await updatePassword(userId, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      console.log('🔐 Password update response payload:', response);
      
      if (response.status || response.success) {
        setSuccess(response.message || 'Password updated successfully!');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(response.message || 'Password update failed. Please try again.');
      }

      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
    } catch (error) {
      console.error('🔐 Password update failed:', error);
      setError(error.response?.data?.message || 'Failed to update password');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const userId = getUserId();
      const response = await uploadAvatar(userId, file);
      
      if (response.success) {
        setProfileData(prev => ({ ...prev, image: response.data }));
        setSuccess('Avatar updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload avatar');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="p-3 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
          <User className="mr-3 text-red-600" size={32} />
          Admin Profile
        </h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <>
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={profileData.image}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-red-100"
                />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors cursor-pointer"
                >
                  <Camera size={16} />
                </label>
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <div className="flex items-center justify-center text-red-600 mb-2">
                <Shield size={16} className="mr-1" />
                <span className="text-sm font-medium">{profileData.role}</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <Mail size={18} className="mr-3 text-gray-400" />
                <span className="text-sm">{profileData.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone size={18} className="mr-3 text-gray-400" />
                <span className="text-sm">{profileData.phoneNo || 'Not provided'}</span>
              </div>
              {profileData.dob && (
                <div className="flex items-center text-gray-600">
                  <Calendar size={18} className="mr-3 text-gray-400" />
                  <span className="text-sm">Born {new Date(profileData.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors ${
                isEditing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              <Edit size={18} />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Account Type</span>
                <span className="text-sm font-semibold text-gray-800">Premium</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Login</span>
                <span className="text-sm text-gray-800">Today, 10:30 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Profile Settings & Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <User className="mr-2 text-red-600" size={24} />
              Profile Settings
            </h3>
            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your last name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNo"
                    value={profileData.phoneNo}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Role (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profileData.role}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Lock className="mr-2 text-red-600" size={24} />
              Change Password
            </h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters long
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {/* Update Password Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isPasswordUpdating}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Lock size={18} />
                  <span>{isPasswordUpdating ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Login Notifications</h4>
                  <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
