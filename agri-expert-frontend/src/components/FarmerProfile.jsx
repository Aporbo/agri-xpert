import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    currentPassword: '', 
    newPassword: '',
    confirmPassword: '' 
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setForm(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { name, email } = form;
      const response = await axios.put('/api/farmer/profile', { name, email });
      
      // Update local storage and state
      const updatedUser = { ...user, ...response.data.farmer };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setMessage({ 
        text: 'Profile updated successfully!', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update profile', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ 
        text: 'New passwords do not match', 
        type: 'error' 
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { currentPassword, newPassword } = form;
      await axios.put('/farmer/profile/password', { 
        currentPassword, 
        newPassword 
      });
      
      setMessage({ 
        text: 'Password updated successfully!', 
        type: 'success' 
      });
      
      // Clear password fields
      setForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Password update error:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update password', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar - Matching the dashboard */}
      <aside className="bg-green-700 text-white w-full md:w-64 p-6 space-y-6 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">👨‍🌾 {user?.name || 'Farmer'}</h2>
          <p className="text-sm text-green-200">{user?.email}</p>
        </div>

        <nav className="flex flex-col gap-3">
          <Link to="/farmer" className="hover:bg-green-800 p-2 rounded">🏠 Dashboard</Link>
          <Link to="/farmer/history" className="hover:bg-green-800 p-2 rounded">📜 Soil Test History</Link>
          <Link to="/farmer/profile" className="hover:bg-green-800 p-2 rounded bg-green-800">🧾 My Profile</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
            <FiUser className="text-green-600" />
            My Profile
          </h1>
          <Link
            to="/farmer"
            className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Back to Dashboard
          </Link>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Navigation */}
          <div className="w-full md:w-48 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === 'profile' 
                  ? 'bg-green-100 text-green-700 border-l-4 border-green-600' 
                  : 'hover:bg-gray-100'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === 'password' 
                  ? 'bg-green-100 text-green-700 border-l-4 border-green-600' 
                  : 'hover:bg-gray-100'
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            {message.text && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <FiCheckCircle className="text-lg" />
                ) : (
                  <FiAlertCircle className="text-lg" />
                )}
                {message.text}
              </div>
            )}

            {activeTab === 'profile' ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-white flex justify-center items-center ${
                    isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : 'Update Profile'}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="currentPassword"
                      value={form.currentPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    <FiLock className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                      minLength="8"
                    />
                    <FiLock className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                      minLength="8"
                    />
                    <FiLock className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-white flex justify-center items-center ${
                    isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerProfile;