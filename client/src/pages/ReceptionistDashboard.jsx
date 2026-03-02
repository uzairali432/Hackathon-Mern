import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../services/authApi';
import { logout as logoutAction } from '../store/slices/authSlice';
import { LogOut, Settings, User, Calendar, Users, Phone, Clock, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 h-auto sm:h-16 py-3 sm:py-0">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center shadow-lg">
                <Phone className="text-white" size={22} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Reception Desk</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 font-medium truncate">Welcome, {user?.firstName} {user?.lastName}!</span>
                {user?.role && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 capitalize border border-yellow-200">
                    {user.role}
                  </span>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">{isLoading ? 'Signing out...' : 'Sign Out'}</span>
                  <span className="sm:hidden">{isLoading ? 'Out...' : 'Out'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reception Management</h2>
          <p className="text-gray-600">Handle appointments, patient registrations, and scheduling</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Appointments Card */}
          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl hover:border-blue-300 transition-all duration-300">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-blue-100 rounded-xl p-4 group-hover:scale-110 transition-transform">
                <Calendar className="text-blue-600" size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Appointments</h3>
                <p className="text-sm text-gray-600">Schedule and manage appointments</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/receptionist/appointments')}
              className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Manage Appointments
            </button>
          </div>

          {/* Patient Records Card */}
          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl hover:border-teal-300 transition-all duration-300">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-teal-100 rounded-xl p-4 group-hover:scale-110 transition-transform">
                <Users className="text-teal-600" size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Patient Records</h3>
                <p className="text-sm text-gray-600">View and manage patient database</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/receptionist/patients')}
              className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-indigo-100 rounded-xl p-4">
                <User className="text-indigo-600" size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Your Profile</h3>
                <p className="text-sm text-gray-600">Email: {user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Edit Profile
            </button>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-blue-100 rounded-xl p-4">
                <Settings className="text-blue-600" size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Manage your account security</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/settings')}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Account Settings
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold text-blue-600">Active</p>
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-3">Available for duty</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Department</p>
            <p className="text-3xl font-bold text-teal-600">Reception</p>
            <p className="text-xs text-gray-500 mt-3">Main desk operations</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-xl transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Shift</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-indigo-600">Day</p>
              <Clock className="text-indigo-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-3">8:00 AM - 5:00 PM</p>
          </div>
        </div>
      </main>
    </div>
  );
}
