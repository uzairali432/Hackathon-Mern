import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../services/authApi';
import { useGetAllUsersQuery } from '../services/userApi';
import { logout as logoutAction } from '../store/slices/authSlice';
import { 
  LogOut, 
  Settings, 
  User, 
  Calendar, 
  Pill, 
  Activity, 
  Heart, 
  Thermometer, 
  Bell, 
  Search, 
  ChevronRight,
  Stethoscope,
  PhoneCall,
  ShieldCheck,
  Star
} from 'lucide-react';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [logout, { isLoading }] = useLogoutMutation();
  const { data: doctorsData, isLoading: isLoadingDoctors } = useGetAllUsersQuery({ role: 'doctor' });
  const doctors = doctorsData?.users || [];

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
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] font-['Inter'] selection:bg-teal-100 selection:text-teal-900">
      
      {/* Top Header Navigation */}
      <nav className="bg-white border-b border-[#E9ECEF] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo area */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A896] to-[#028F7E] flex items-center justify-center shadow-sm">
                <Stethoscope className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-[#2E86AB]">
                Med<span className="text-[#00A896]">Connect</span>
              </span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex max-w-md w-full mx-8">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#A0AEC0] group-focus-within:text-[#00A896] transition-colors" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-2 border border-[#E9ECEF] rounded-full leading-5 bg-[#F8F9FA] placeholder-[#A0AEC0] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] sm:text-sm transition-all duration-200" 
                  placeholder="Ask a medical question, find a doctor..." 
                />
              </div>
            </div>

            {/* Right Header Icons */}
            <div className="flex items-center gap-3 sm:gap-5">
              <button className="relative p-2 text-[#6C757D] hover:text-[#00A896] transition-colors rounded-full hover:bg-teal-50">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-[#DC3545] border-2 border-white"></span>
              </button>
              
              <div className="h-8 w-px bg-[#E9ECEF] hidden sm:block"></div>
              
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-medium text-[#212529]">{user?.firstName || 'John'} {user?.lastName || 'Doe'}</span>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#28A745]" />
                    <span className="text-[10px] uppercase font-bold text-[#28A745] tracking-wider">HIPAA Verified</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#E9ECEF] border border-[#DEE2E6] overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${user?.firstName || 'J'}+${user?.lastName || 'D'}&background=2E86AB&color=fff`} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex max-w-7xl mx-auto">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 pt-8 pb-12 pr-8 border-r border-[#E9ECEF] min-h-[calc(100vh-4rem)]">
          <nav className="space-y-1">
            <button onClick={() => handleNavigate('/patient-dashboard')} className="w-full text-left bg-teal-50 text-[#00A896] group flex items-center px-4 py-3 text-sm font-medium rounded-xl">
              <Activity className="mr-3 flex-shrink-0 h-5 w-5 text-[#00A896]" />
              Dashboard
            </button>
            <button onClick={() => handleNavigate('/patient/appointments')} className="w-full text-left text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2E86AB] group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors">
              <Calendar className="mr-3 flex-shrink-0 h-5 w-5 text-[#A0AEC0] group-hover:text-[#2E86AB] transition-colors" />
              Appointments
            </button>
            <button onClick={() => handleNavigate('/patient/prescriptions')} className="w-full text-left text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2E86AB] group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors">
              <Pill className="mr-3 flex-shrink-0 h-5 w-5 text-[#A0AEC0] group-hover:text-[#2E86AB] transition-colors" />
              Medications
            </button>
            <button onClick={() => handleNavigate('/profile')} className="w-full text-left text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2E86AB] group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors">
              <User className="mr-3 flex-shrink-0 h-5 w-5 text-[#A0AEC0] group-hover:text-[#2E86AB] transition-colors" />
              Health Profile
            </button>
            <button onClick={() => handleNavigate('/settings')} className="w-full text-left text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2E86AB] group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors">
              <Settings className="mr-3 flex-shrink-0 h-5 w-5 text-[#A0AEC0] group-hover:text-[#2E86AB] transition-colors" />
              Settings
            </button>
          </nav>
          
          <div className="mt-12 pt-8 border-t border-[#E9ECEF]">
            <button 
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-[#DC3545] hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              {isLoading ? 'Logging out...' : 'Log out securely'}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full pt-6 pb-12 px-4 sm:px-6 lg:pl-10 lg:pr-8">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#212529] mb-1">Good Morning, {user?.firstName || 'John'}</h1>
              <p className="text-[#6C757D] text-sm sm:text-base">Here is your daily health summary for today.</p>
            </div>
            
            {/* Emergency Contact Button */}
            <button className="flex items-center justify-center gap-2 bg-[#DC3545]/10 text-[#DC3545] px-4 py-2.5 rounded-lg hover:bg-[#DC3545]/20 hover:scale-[1.02] transition-all font-medium text-sm border border-[#DC3545]/20">
              <PhoneCall className="w-4 h-4" />
              Emergency Care
            </button>
          </div>

          {/* Doctors List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#212529]">Available Specialists</h2>
              <button className="text-sm font-medium text-[#00A896] hover:text-[#028F7E] transition-colors">See all doctors</button>
            </div>
            
            {isLoadingDoctors ? (
              <div className="flex space-x-4 overflow-hidden">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="min-w-[260px] h-[140px] bg-white rounded-2xl border border-[#E9ECEF] p-5 shadow-sm animate-pulse flex flex-col justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 py-1 space-y-2">
                           <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                           <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="h-8 bg-gray-100 rounded-xl w-full mt-4"></div>
                   </div>
                 ))}
              </div>
            ) : doctors.length > 0 ? (
              <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
                {doctors.map(doctor => (
                  <div key={doctor._id} className="min-w-[280px] snap-start bg-white rounded-2xl p-5 border border-[#E9ECEF] shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-[#E8F4F8] border border-[#2E86AB]/20 flex-shrink-0 overflow-hidden">
                        <img 
                          src={`https://ui-avatars.com/api/?name=Dr.+${doctor.lastName}&background=E8F4F8&color=2E86AB&size=128`} 
                          alt={`Dr. ${doctor.lastName}`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold text-[#212529] truncate">Dr. {doctor.firstName} {doctor.lastName}</h3>
                        <p className="text-xs font-medium text-[#2E86AB] mb-1">Medical Specialist</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                           <div className="flex items-center text-amber-400">
                             <Star className="w-3.5 h-3.5 fill-current" />
                             <span className="text-xs font-bold text-[#495057] ml-1">4.9 {doctor.reviews ? `(${doctor.reviews})` : ''}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <button className="w-full py-2 bg-[#F8F9FA] hover:bg-[#E8F4F8] text-[#2E86AB] text-sm font-semibold rounded-xl border border-[#E9ECEF] hover:border-[#2E86AB]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/20">
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-[#E9ECEF] shadow-sm text-center">
                <Stethoscope className="w-10 h-10 text-[#A0AEC0] mx-auto mb-3" />
                <h3 className="text-lg font-medium text-[#495057] mb-1">No doctors available</h3>
                <p className="text-sm text-[#6C757D]">Check back later for available specialists.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column: Appointments & Reminders */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Upcoming Appointment */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#212529]">Upcoming Appointment</h2>
                  <button className="text-sm font-medium text-[#00A896] hover:text-[#028F7E]">View all</button>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-[#E9ECEF] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-[#E9ECEF] flex-shrink-0 overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=Dr.+Smith&background=F8F9FA&color=2E86AB" alt="Dr. Smith" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#212529]">Dr. Sarah Smith</h3>
                        <p className="text-[#6C757D] text-sm mb-2">Cardiologist • General Checkup</p>
                        <div className="flex items-center gap-4 text-sm font-medium text-[#2E86AB] bg-blue-50 px-3 py-1.5 rounded-lg inline-flex">
                          <Calendar className="w-4 h-4" />
                          Thu, Oct 12 • 10:30 AM
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 md:flex-col lg:flex-row w-full md:w-auto">
                      <button className="flex-1 lg:flex-none px-5 py-2.5 bg-white border border-[#DEE2E6] text-[#495057] rounded-xl text-sm font-medium hover:bg-[#F8F9FA] transition-colors focus:ring-2 focus:ring-[#00A896]/20 outline-none">
                        Reschedule
                      </button>
                      <button className="flex-1 lg:flex-none px-5 py-2.5 bg-[#00A896] text-white rounded-xl text-sm font-medium hover:bg-[#028F7E] transition-colors shadow-sm focus:ring-2 focus:ring-[#00A896]/50 outline-none">
                        Join Telehealth
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Medication Schedule */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#212529]">Today's Medications</h2>
                  <button className="text-sm font-medium text-[#00A896] hover:text-[#028F7E]">Add reminder</button>
                </div>
                
                <div className="bg-white rounded-2xl border border-[#E9ECEF] shadow-sm overflow-hidden">
                  <ul className="divide-y divide-[#E9ECEF]">
                    {/* Med 1 */}
                    <li className="p-5 flex items-center justify-between hover:bg-[#F8F9FA] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#00A896]">
                          <Pill className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#212529]">Lisinopril</h4>
                          <p className="text-sm text-[#6C757D]">10mg • After breakfast</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-[#6C757D]">08:00 AM</span>
                        <button className="w-8 h-8 rounded-full bg-[#28A745] text-white flex items-center justify-center shadow-sm">
                          ✓
                        </button>
                      </div>
                    </li>
                    {/* Med 2 */}
                    <li className="p-5 flex items-center justify-between hover:bg-[#F8F9FA] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                          <Pill className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#212529]">Atorvastatin</h4>
                          <p className="text-sm text-[#6C757D]">20mg • After dinner</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-[#2E86AB]">08:00 PM</span>
                        <button className="w-8 h-8 rounded-full border-2 border-[#DEE2E6] text-transparent hover:border-[#00A896] transition-colors"></button>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Right Column: Health Timeline & Quick Access */}
            <div className="space-y-8">
              
              {/* Treatment Progress */}
              <section className="bg-gradient-to-br from-[#2E86AB] to-[#1F5F7A] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
                
                <h3 className="text-lg font-semibold mb-2 relative z-10">Hypertension Goal</h3>
                <p className="text-blue-100 text-sm mb-6 relative z-10">You're making great progress! Keep taking your medication as prescribed.</p>
                
                <div className="relative z-10">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>Progress</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-[85%]"></div>
                  </div>
                </div>
              </section>

              {/* Lab Results Quick Access */}
              <section>
                <h2 className="text-lg font-semibold text-[#212529] mb-4">Recent Lab Results</h2>
                <div className="bg-white rounded-2xl border border-[#E9ECEF] shadow-sm p-2">
                  
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F9FA] transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-center text-[#6C757D]">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#212529]">Comprehensive Metabolic Panel</p>
                        <p className="text-xs text-[#6C757D]">Oct 5, 2023</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#A0AEC0] group-hover:text-[#2E86AB] transition-colors" />
                  </button>
                  
                  <div className="h-px bg-[#E9ECEF] mx-4 my-1"></div>

                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F9FA] transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-center text-[#6C757D]">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#212529]">Lipid Panel</p>
                        <p className="text-xs text-[#6C757D]">Sep 12, 2023</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#A0AEC0] group-hover:text-[#2E86AB] transition-colors" />
                  </button>

                </div>
              </section>
              
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation (Visible only on small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E9ECEF] pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center justify-center w-full h-full text-[#00A896]">
            <Activity className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full text-[#A0AEC0] hover:text-[#2E86AB]">
            <Calendar className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Appointments</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full text-[#A0AEC0] hover:text-[#2E86AB]">
            <Pill className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Meds</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full text-[#A0AEC0] hover:text-[#2E86AB]">
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
