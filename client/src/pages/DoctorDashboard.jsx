import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../services/authApi';
import { logout as logoutAction } from '../store/slices/authSlice';
import { LogOut, Settings, User, Calendar, Pill, Brain, BarChart3, FileText } from 'lucide-react';
import { useState } from 'react';
import AppointmentsList from '../components/doctor/AppointmentsList';
import PatientHistory from '../components/doctor/PatientHistory';
import DiagnosisForm from '../components/doctor/DiagnosisForm';
import PrescriptionForm from '../components/doctor/PrescriptionForm';
import AIAssistance from '../components/doctor/AIAssistance';
import DoctorStats from '../components/doctor/DoctorStats';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [logout, { isLoading }] = useLogoutMutation();
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      navigate('/login/doctor');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(logoutAction());
      navigate('/login/doctor');
    }
  };

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patient-history', label: 'Patient History', icon: User },
    { id: 'diagnosis', label: 'Add Diagnosis', icon: FileText },
    { id: 'prescription', label: 'Write Prescription', icon: Pill },
    { id: 'ai-assistance', label: 'AI Assistance', icon: Brain },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 h-auto sm:h-16 py-3 sm:py-0">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Doctor Portal</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 truncate">Welcome, {user?.firstName} {user?.lastName}!</span>
                {user?.role && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {user.role}
                  </span>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings size={18} />
                  <span className="hidden sm:inline">Settings</span>
                </button>
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
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-4 text-sm font-medium whitespace-nowrap flex items-center justify-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Appointments</h2>
              <AppointmentsList />
            </div>
          )}

          {/* Patient History Tab */}
          {activeTab === 'patient-history' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient History</h2>
                <input
                  type="text"
                  placeholder="Enter patient ID to view history..."
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {selectedPatientId && <PatientHistory patientId={selectedPatientId} />}
            </div>
          )}

          {/* Diagnosis Tab */}
          {activeTab === 'diagnosis' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Diagnosis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                  <input
                    type="text"
                    placeholder="Enter patient ID"
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
                  <input
                    type="text"
                    placeholder="Enter appointment ID"
                    value={selectedAppointmentId}
                    onChange={(e) => setSelectedAppointmentId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {selectedPatientId && selectedAppointmentId && (
                <DiagnosisForm
                  appointmentId={selectedAppointmentId}
                  patientId={selectedPatientId}
                  onSuccess={() => {
                    setSelectedAppointmentId('');
                  }}
                />
              )}
            </div>
          )}

          {/* Prescription Tab */}
          {activeTab === 'prescription' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Write Prescription</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                  <input
                    type="text"
                    placeholder="Enter patient ID"
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter diagnosis ID (optional)"
                    value={selectedAppointmentId}
                    onChange={(e) => setSelectedAppointmentId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {selectedPatientId && (
                <PrescriptionForm
                  patientId={selectedPatientId}
                  diagnosisId={selectedAppointmentId}
                  onSuccess={() => {
                    setSelectedAppointmentId('');
                  }}
                />
              )}
            </div>
          )}

          {/* AI Assistance Tab */}
          {activeTab === 'ai-assistance' && <AIAssistance />}

          {/* Statistics Tab */}
          {activeTab === 'stats' && <DoctorStats />}
        </div>
      </main>
    </div>
  );
}
