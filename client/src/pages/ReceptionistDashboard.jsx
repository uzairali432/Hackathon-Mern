import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../services/authApi';
import { logout as logoutAction } from '../store/slices/authSlice';
import { LogOut, Settings, User, Calendar, Users } from 'lucide-react';
import PatientRegistration from '../components/receptionist/PatientRegistration';
import AppointmentBooking from '../components/receptionist/AppointmentBooking';
import DailySchedule from '../components/receptionist/DailySchedule';

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      navigate('/login/receptionist');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(logoutAction());
      navigate('/login/receptionist');
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 h-auto sm:h-16 py-3 sm:py-0">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Receptionist Dashboard</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 truncate">Welcome, {user?.firstName} {user?.lastName}!</span>
                {user?.role && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 capitalize">
                    {user.role}
                  </span>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">{isLoading ? 'Logging out...' : 'Logout'}</span>
                  <span className="sm:hidden">{isLoading ? 'Out...' : 'Logout'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointments Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
                <p className="text-sm text-gray-500">Manage and schedule appointments</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/receptionist/appointments')}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              Manage Appointments
            </button>
          </div>

          {/* Patient Records Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-full p-3">
                <Users className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Patient Records</h3>
                <p className="text-sm text-gray-500">View and manage patient records</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/receptionist/patients')}
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
            >
              View Records
            </button>
          </div>
        </div>

        {/* Receptionist Tools */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <PatientRegistration />
          </div>
          <div>
            <AppointmentBooking />
          </div>
          <div>
            <DailySchedule />
          </div>
        </div>

        {/* Profile & Settings Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-full p-3">
                <User className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                <p className="text-sm text-gray-500">Email: {user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/profile')}
              className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium transition-colors"
            >
              Edit Profile
            </button>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 rounded-full p-3">
                <Settings className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-500">Manage your account</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/settings')}
              className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors"
            >
              Go to Settings
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Status</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">Active</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Department</p>
            <p className="text-2xl font-bold text-green-600 mt-2">Reception</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Shift</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">Day</p>
          </div>
        </div>
      </main>
    </div>
  );
}
