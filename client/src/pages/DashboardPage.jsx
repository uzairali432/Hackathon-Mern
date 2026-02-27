import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../services/authApi';
import { logout as logoutAction } from '../store/slices/authSlice';
import { LogOut, Settings, User } from 'lucide-react';

export default function DashboardPage() {
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
      // Force logout even if API call fails
      dispatch(logoutAction());
      navigate('/login');
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName} {user?.lastName}!
              </span>
              {user?.role === 'admin' && (
                <button
                  onClick={() => handleNavigate('/admin')}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                <LogOut size={18} />
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                <p className="text-sm text-gray-500">Email: {user?.email}</p>
                <p className="text-sm text-gray-500">Role: {user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/profile')}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Edit Profile
            </button>
          </div>

          {/* Account Settings Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-full p-3">
                <Settings className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                <p className="text-sm text-gray-500">Manage your account security</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/settings')}
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            >
              Go to Settings
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Account Status</p>
            <p className="text-2xl font-bold text-green-600 mt-2">Active</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Member Since</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Last Login</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Just now'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
