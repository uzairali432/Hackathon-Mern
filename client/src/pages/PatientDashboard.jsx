import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../services/authApi';
import { logout as logoutAction } from '../store/slices/authSlice';
import { LogOut, Settings, User, Calendar, Pill } from 'lucide-react';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(logoutAction());
      navigate('/login');
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 h-auto sm:h-16 py-3 sm:py-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Patient Dashboard
                </h1>
                <p className="text-xs text-gray-500">Welcome back, {user?.firstName}!</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                {user?.role && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 capitalize border border-green-200">
                    {user.role}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 disabled:opacity-50 transition-all duration-200 hover:shadow-sm"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">{isLoading ? 'Logging out...' : 'Logout'}</span>
                <span className="sm:hidden">{isLoading ? 'Out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.firstName} {user?.lastName}!
          </h2>
          <p className="text-gray-600">Manage your health records and appointments</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Appointments Card */}
          <div className="group bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="text-blue-600" size={28} />
              </div>
              <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Appointments</h3>
            <p className="text-sm text-gray-600 mb-4">View and manage your appointment history</p>
            <button
              onClick={() => handleNavigate('/patient/appointments')}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
            >
              View Appointments
            </button>
          </div>

          {/* Prescriptions Card */}
          <div className="group bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Pill className="text-green-600" size={28} />
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Prescriptions</h3>
            <p className="text-sm text-gray-600 mb-4">View, download, and understand your prescriptions</p>
            <button
              onClick={() => handleNavigate('/patient/prescriptions')}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
            >
              View Prescriptions
            </button>
          </div>

          {/* Profile Card */}
          <div className="group bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <User className="text-purple-600" size={28} />
              </div>
              <div className="w-2 h-2 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Profile</h3>
            <p className="text-sm text-gray-600 mb-4">Update your personal information</p>
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Account Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Account Settings Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl">
                <Settings className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Account Settings</h3>
                <p className="text-sm text-gray-600">Manage your account security</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/settings')}
              className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Go to Settings
            </button>
          </div>

          {/* Account Status Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Account Status</p>
                <p className="text-3xl font-bold text-green-600">Active</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-300">
            <p className="text-sm font-medium text-gray-600 mb-2">Account Status</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-2xl font-bold text-gray-900">Active</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-300">
            <p className="text-sm font-medium text-gray-600 mb-2">Subscription Plan</p>
            <p className="text-2xl font-bold text-blue-600 capitalize">{user?.subscription?.plan || 'Free'}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-300">
            <p className="text-sm font-medium text-gray-600 mb-2">Member Since</p>
            <p className="text-2xl font-bold text-purple-600">
              {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
