import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetPatientAppointmentsQuery } from '../services/patientApi';
import { ArrowLeft, Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle, Video, Stethoscope, MapPin } from 'lucide-react';

export default function PatientAppointmentsPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data, isLoading, error } = useGetPatientAppointmentsQuery({ status: statusFilter || undefined });

  const appointments = data?.data || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-[#28A745]" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-[#DC3545]" />;
      case 'in-progress':
        return <AlertCircle className="w-5 h-5 text-[#2E86AB]" />;
      default:
        return <Clock className="w-5 h-5 text-[#F59E0B]" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-[#155724] border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-[#721C24] border-red-200';
      case 'in-progress':
        return 'bg-blue-50 text-[#0C5460] border-blue-200';
      default:
        return 'bg-orange-50 text-[#856404] border-orange-200';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] font-['Inter'] selection:bg-teal-100 selection:text-teal-900 pb-12">
      
      {/* Header */}
      <nav className="bg-white border-b border-[#E9ECEF] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/patient-dashboard')}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2E86AB] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-[#212529]">My Appointments</h1>
            </div>
            
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#00A896]/10 text-[#00A896] hover:bg-[#00A896]/20 font-medium rounded-xl transition-colors">
              <Calendar className="w-4 h-4" />
              Schedule New
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-5xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-[#495057] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#A0AEC0]" />
              Filter Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#DEE2E6] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] bg-white text-[#212529] min-w-[160px]"
            >
              <option value="">All Appointments</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <button className="sm:hidden w-full flex justify-center items-center gap-2 px-4 py-2 bg-[#00A896] text-white font-medium rounded-xl transition-colors shadow-sm">
            <Calendar className="w-4 h-4" />
            Schedule New
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00A896]/20 border-t-[#00A896]"></div>
            </div>
            <p className="mt-4 text-[#6C757D] font-medium">Loading appointments...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-red-100">
              <AlertCircle className="w-5 h-5 text-[#DC3545]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#DC3545] text-lg mb-1">Failed to connect</h3>
              <p className="text-red-900/70 text-sm">We couldn't load your appointments. Please check your connection and try again.</p>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {!isLoading && !error && (
          <>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-16 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-6 border border-[#E9ECEF]">
                  <Calendar className="w-10 h-10 text-[#A0AEC0]" />
                </div>
                <h3 className="text-xl font-bold text-[#212529] mb-2">No Appointments Found</h3>
                <p className="text-[#6C757D] max-w-sm mb-8">
                  {statusFilter
                    ? `You don't have any ${statusFilter} appointments matching your criteria.`
                    : "You're all caught up! You have no upcoming appointments."}
                </p>
                <button className="px-6 py-2.5 bg-[#00A896] text-white font-medium rounded-xl hover:bg-[#028F7E] transition-colors shadow-sm focus:ring-4 focus:ring-[#00A896]/30">
                  Book an Appointment
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div className="flex flex-col md:flex-row">
                      
                      {/* Left Sidebar (Date/Time Focus) - Desktop */}
                      <div className="hidden md:flex flex-col items-center justify-center w-48 bg-[#F8F9FA] border-r border-[#E9ECEF] p-6 text-center">
                        <span className="text-[#DC3545] font-bold uppercase text-xs mb-1">
                          {new Date(appointment.startTime).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-4xl font-black text-[#212529] mb-1">
                          {new Date(appointment.startTime).getDate()}
                        </span>
                        <span className="text-sm font-medium text-[#6C757D] mb-4">
                          {new Date(appointment.startTime).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-[#2E86AB]">
                          <Clock className="w-4 h-4" />
                          {formatTime(appointment.startTime)}
                        </div>
                      </div>

                      {/* Main Content Info */}
                      <div className="flex-1 p-6 sm:p-8 relative">
                        {/* Status Badge */}
                        <div className="absolute top-6 right-6">
                          <div className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusStyle(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span className="uppercase tracking-wider">{appointment.status.replace('-', ' ')}</span>
                          </div>
                        </div>

                        <div className="pr-32 mb-6 text-left">
                          <h3 className="text-xl font-bold text-[#212529] mb-2">{appointment.title}</h3>
                          {appointment.description && (
                            <p className="text-[#6C757D] text-sm leading-relaxed">{appointment.description}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          {/* Mobile Date/Time inline */}
                          <div className="md:hidden flex items-start gap-3 p-3 rounded-xl bg-[#F8F9FA] border border-[#E9ECEF]">
                             <Calendar className="w-5 h-5 text-[#2E86AB] mt-0.5" />
                             <div>
                               <p className="text-xs font-semibold text-[#868E96] uppercase tracking-wider mb-0.5">Date & Time</p>
                               <p className="text-sm font-medium text-[#212529]">{formatDate(appointment.startTime)}</p>
                               <p className="text-sm font-semibold text-[#2E86AB]">{formatTime(appointment.startTime)}</p>
                             </div>
                          </div>

                          {appointment.doctorId && (
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F8F9FA] border border-[#E9ECEF]">
                              <div className="w-10 h-10 rounded-full bg-white border border-[#DEE2E6] overflow-hidden flex-shrink-0">
                                <img src={`https://ui-avatars.com/api/?name=${appointment.doctorId.firstName}+${appointment.doctorId.lastName}&background=2E86AB&color=fff`} alt="Doctor" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-[#868E96] uppercase tracking-wider mb-0.5">Physician</p>
                                <p className="text-sm font-bold text-[#212529]">Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}</p>
                                <p className="text-xs text-[#6C757D]">Cardiology</p>
                              </div>
                            </div>
                          )}

                          {appointment.type && (
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F8F9FA] border border-[#E9ECEF]">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-[#DEE2E6]">
                                {appointment.type.toLowerCase().includes('video') || appointment.type.toLowerCase().includes('tele') 
                                  ? <Video className="w-5 h-5 text-[#00A896]" /> 
                                  : <MapPin className="w-5 h-5 text-[#2E86AB]" />}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-[#868E96] uppercase tracking-wider mb-0.5">Location / Type</p>
                                <p className="text-sm font-bold text-[#212529] capitalize">{appointment.type}</p>
                                <p className="text-xs text-[#6C757D]">
                                  {appointment.type.toLowerCase().includes('video') ? 'Link will be sent' : 'Main Clinic Building'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {appointment.notes && (
                          <div className="mt-6 p-4 bg-yellow-50/50 rounded-xl border border-yellow-200 border-l-4 border-l-yellow-400">
                            <p className="text-sm text-[#856404]">
                              <span className="font-semibold block mb-1">Important Instructions:</span> {appointment.notes}
                            </p>
                          </div>
                        )}
                        
                        {/* Actions for active appointments */}
                        {(appointment.status === 'scheduled' || appointment.status === 'in-progress') && (
                          <div className="mt-6 pt-6 border-t border-[#E9ECEF] flex flex-col sm:flex-row gap-3">
                             <button className="flex-1 px-4 py-2 border border-[#DEE2E6] bg-white text-[#495057] font-medium rounded-xl hover:bg-[#F8F9FA] transition-colors focus:ring-4 focus:ring-[#E9ECEF]">
                               Reschedule
                             </button>
                             <button className="flex-1 px-4 py-2 border border-red-200 bg-red-50 text-[#DC3545] font-medium rounded-xl hover:bg-red-100 transition-colors focus:ring-4 focus:ring-red-100">
                               Cancel Appointment
                             </button>
                             {(appointment.type?.toLowerCase().includes('video') || appointment.type?.toLowerCase().includes('tele')) && (
                               <button className="flex-1 px-4 py-2 bg-[#00A896] text-white font-medium rounded-xl hover:bg-[#028F7E] transition-colors flex items-center justify-center gap-2 focus:ring-4 focus:ring-[#00A896]/30">
                                 <Video className="w-4 h-4" /> Join Call
                               </button>
                             )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

