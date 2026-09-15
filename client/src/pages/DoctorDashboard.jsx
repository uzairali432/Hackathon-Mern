import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../services/authApi';
import { logout as logoutAction } from '../store/slices/authSlice';
import { LogOut, Settings, User, Calendar, Pill, Brain, BarChart3, FileText, CheckCircle, ShieldCheck, Stethoscope } from 'lucide-react';
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
    { id: 'patient-history', label: 'Patient Map', icon: User },
    { id: 'diagnosis', label: 'Clinical Dx', icon: FileText },
    { id: 'prescription', label: 'Write Rx', icon: Pill },
    { id: 'ai-assistance', label: 'Med AI', icon: Brain },
    { id: 'stats', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] font-['Inter'] selection:bg-teal-100 selection:text-teal-900 pb-12">
      
      {/* Header */}
      <nav className="bg-white border-b border-[#E9ECEF] sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 gap-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E86AB] to-[#1A5F7A] flex items-center justify-center shadow-sm">
                 <Stethoscope className="text-white w-6 h-6" />
               </div>
               <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#212529]">Physician Portal</h1>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00A896]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    HIPAA Secure Session
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-3 bg-[#F8F9FA] px-4 py-2 rounded-xl border border-[#E9ECEF] w-full sm:w-auto">
                <div className="w-8 h-8 rounded-lg bg-[#2E86AB] flex items-center justify-center text-white font-bold text-sm">
                   {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <span className="text-sm font-bold text-[#212529] block leading-none">Dr. {user?.lastName}</span>
                  <span className="text-xs text-[#6C757D] font-medium block mt-0.5 capitalize">{user?.role || 'Doctor'}</span>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#495057] hover:bg-[#F8F9FA] border border-transparent hover:border-[#DEE2E6] transition-all"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#495057] hover:bg-[#F8F9FA] border border-transparent hover:border-[#DEE2E6] transition-all"
                >
                  <Settings size={16} />
                  <span className="hidden sm:inline">Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#DC3545] hover:bg-red-50 border border-transparent hover:border-red-100 transition-all disabled:opacity-50"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">{isLoading ? 'Wait...' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] mb-8 overflow-hidden">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[120px] px-2 py-4 text-sm font-semibold whitespace-nowrap flex flex-col items-center justify-center gap-2 transition-all relative ${
                    isActive
                      ? 'text-[#2E86AB] bg-[#F8F9FA]'
                      : 'text-[#6C757D] hover:text-[#212529] hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-[#2E86AB]" : "text-[#A0AEC0]"} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2E86AB] rounded-t-lg"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E9ECEF]">
                <div>
                  <h2 className="text-xl font-bold text-[#212529]">Clinical Schedule</h2>
                  <p className="text-sm text-[#6C757D]">Manage today's patient visits.</p>
                </div>
              </div>
              <AppointmentsList />
            </div>
          )}

          {/* Patient History Tab */}
          {activeTab === 'patient-history' && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-6 sm:p-8">
              <div className="mb-6 pb-4 border-b border-[#E9ECEF]">
                <h2 className="text-xl font-bold text-[#212529]">Patient Medical Record Repository</h2>
                <p className="text-sm text-[#6C757D]">Access secure patient history and charts.</p>
              </div>
              <div className="max-w-xl mb-8">
                <label className="block text-sm font-bold text-[#495057] mb-2 uppercase tracking-wide">Enter Medical Record # (MRN) or Patient ID</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-[#A0AEC0]" />
                  <input
                    type="text"
                    placeholder="e.g. PAT-9482..."
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/20 focus:border-[#2E86AB] font-medium"
                  />
                </div>
              </div>
              {selectedPatientId && <PatientHistory patientId={selectedPatientId} />}
            </div>
          )}

          {/* Diagnosis Tab */}
          {activeTab === 'diagnosis' && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-6 sm:p-8">
              <div className="mb-6 pb-4 border-b border-[#E9ECEF]">
                <h2 className="text-xl font-bold text-[#212529]">Record Clinical Diagnosis</h2>
                <p className="text-sm text-[#6C757D]">File new assessment notes for a patient encounter.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-3xl">
                <div>
                  <label className="block text-sm font-bold text-[#495057] mb-2 uppercase tracking-wide">Patient ID / MRN</label>
                  <input
                    type="text"
                    placeholder="Enter Patient ID"
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/20 focus:border-[#2E86AB] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#495057] mb-2 uppercase tracking-wide">Encounter / Appointment ID</label>
                  <input
                    type="text"
                    placeholder="Enter Appointment ID"
                    value={selectedAppointmentId}
                    onChange={(e) => setSelectedAppointmentId(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/20 focus:border-[#2E86AB] font-medium"
                  />
                </div>
              </div>
              
              {selectedPatientId && selectedAppointmentId ? (
                <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-[#E9ECEF]">
                  <DiagnosisForm
                    appointmentId={selectedAppointmentId}
                    patientId={selectedPatientId}
                    onSuccess={() => {
                      setSelectedAppointmentId('');
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-12 px-4 bg-[#F8F9FA] rounded-2xl border border-dashed border-[#DEE2E6]">
                   <FileText className="w-12 h-12 text-[#A0AEC0] mx-auto mb-3 opacity-50" />
                   <p className="text-[#6C757D] font-medium">Please enter both Patient ID and Appointment ID to record diagnosis.</p>
                </div>
              )}
            </div>
          )}

          {/* Prescription Tab */}
          {activeTab === 'prescription' && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-6 sm:p-8">
              <div className="mb-6 pb-4 border-b border-[#E9ECEF]">
                <h2 className="text-xl font-bold text-[#212529]">Electronic Prescribing (eRx)</h2>
                <p className="text-sm text-[#6C757D]">Issue new medications securely.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-3xl">
                <div>
                  <label className="block text-sm font-bold text-[#495057] mb-2 uppercase tracking-wide">Patient ID / MRN</label>
                  <input
                    type="text"
                    placeholder="Enter Patient ID"
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#495057] mb-2 uppercase tracking-wide">Linked Diagnosis ID <span className="text-[#A0AEC0] font-normal lowercase">(Optional)</span></label>
                  <input
                    type="text"
                    placeholder="Link to specific condition/diagnosis"
                    value={selectedAppointmentId}
                    onChange={(e) => setSelectedAppointmentId(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] font-medium"
                  />
                </div>
              </div>
              
              {selectedPatientId ? (
                <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-[#E9ECEF]">
                  <PrescriptionForm
                    patientId={selectedPatientId}
                    diagnosisId={selectedAppointmentId}
                    onSuccess={() => {
                      setSelectedAppointmentId('');
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-12 px-4 bg-[#F8F9FA] rounded-2xl border border-dashed border-[#DEE2E6]">
                   <Pill className="w-12 h-12 text-[#A0AEC0] mx-auto mb-3 opacity-50" />
                   <p className="text-[#6C757D] font-medium">Please enter a Patient ID to write a prescription.</p>
                </div>
              )}
            </div>
          )}

          {/* AI Assistance Tab */}
          {activeTab === 'ai-assistance' && (
             <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-4 sm:p-0 overflow-hidden">
               <AIAssistance />
             </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
             <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-6 sm:p-8">
                <div className="mb-6 pb-4 border-b border-[#E9ECEF]">
                  <h2 className="text-xl font-bold text-[#212529]">Practice Analytics</h2>
                  <p className="text-sm text-[#6C757D]">Overview of your clinical activity.</p>
                </div>
                <DoctorStats />
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
