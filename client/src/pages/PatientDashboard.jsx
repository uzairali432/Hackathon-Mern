import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../services/authApi';
import { logout as logoutAction } from '../store/slices/authSlice';
import { LogOut, Settings, User, Calendar, Pill, Heart, Clock, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-medscape-light">
      {/* Header */}
      <nav className="bg-white shadow-subtle sticky top-0 z-50 border-b border-medscape-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 h-auto sm:h-16 py-3 sm:py-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-medscape-navy flex items-center justify-center shadow-subtle">
                <Heart className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-medscape-navy">Patient Dashboard</h1>
                <p className="text-xs text-medscape-gray">Welcome, {user?.firstName}!</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                {user?.role && (
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-blue-100 text-medscape-navy capitalize border border-medscape-border">
                    {user.role}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-medscape-text bg-medscape-border hover:bg-medscape-gray hover:text-white disabled:opacity-50 transition-all duration-200"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">{isLoading ? 'Signing out...' : 'Sign Out'}</span>
                <span className="sm:hidden">{isLoading ? 'Out...' : 'Out'}</span>
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
          <div className="group bg-white rounded-lg shadow-soft border border-medscape-border p-6 hover:shadow-clinical transition-all duration-200">
            <div className="flex items-start justify-between mb-5">
              <div className="p-4 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="text-blue-600" size={28} />
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Appointments</h3>
            <p className="text-sm text-gray-600 mb-5">Schedule, view, and manage your medical appointments</p>
            <button
              onClick={() => handleNavigate('/patient/appointments')}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              View Appointments
            </button>
          </div>

          {/* Prescriptions Card */}
          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-2xl hover:border-teal-300 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-5">
              <div className="p-4 bg-teal-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Pill className="text-teal-600" size={28} />
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Prescriptions</h3>
            <p className="text-sm text-gray-600 mb-5">View and download your medication prescriptions</p>
            <button
              onClick={() => handleNavigate('/patient/prescriptions')}
              className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              View Prescriptions
            </button>
          </div>

          {/* Profile Card */}
          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-5">
              <div className="p-4 bg-indigo-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <User className="text-indigo-600" size={28} />
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">My Profile</h3>
            <p className="text-sm text-gray-600 mb-5">Update your personal and medical information</p>
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Account Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Account Settings Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-4 bg-blue-100 rounded-xl">
                <Settings className="text-blue-600" size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Security & Settings</h3>
                <p className="text-sm text-gray-600">Manage your account preferences</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/settings')}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Account Settings
            </button>
          </div>

          {/* Account Status Card */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-lg border border-green-200 p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-green-600">Active</p>
                  <CheckCircle className="text-green-500" size={24} />
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</p>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-3xl font-bold text-green-600">Active</p>
            </div>
            <p className="text-xs text-gray-500 mt-3">Your account is verified</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Plan Type</p>
            <p className="text-3xl font-bold text-blue-600 capitalize">{user?.subscription?.plan || 'Standard'}</p>
            <p className="text-xs text-gray-500 mt-3">Full access enabled</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Member Since</p>
            <p className="text-3xl font-bold text-teal-600">
              {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
            </p>
            <p className="text-xs text-gray-500 mt-3">Registered year</p>
          </div>
        </div>
      </main>
    </div>
  );
}
