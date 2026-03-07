import { useGetDoctorAppointmentsQuery, useUpdateAppointmentStatusMutation } from "../../services/doctorApi";
import { Calendar, Clock, MapPin, User, CheckCircle2, XCircle, AlertCircle, RefreshCw, MoreVertical, ClipboardList } from 'lucide-react';
import { useState } from 'react';

export default function AppointmentsList() {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const { data, isLoading, error, refetch } = useGetDoctorAppointmentsQuery({ status: selectedStatus });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation();

  const appointments = data?.data || [];

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateStatus({ appointmentId, status: newStatus }).unwrap();
    } catch (err) {
      console.error('Failed to update appointment status:', err);
    }
  };

  const statusConfig = {
    scheduled: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Scheduled' },
    'in-progress': { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: 'In Progress' },
    completed: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Completed' },
    cancelled: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', label: 'Cancelled' }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-16 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#E9ECEF] border-t-[#2E86AB]"></div>
        <p className="text-[#6C757D] font-medium animate-pulse">Loading schedule securely...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-red-800 font-bold mb-1">Unable to load schedule</h3>
        <p className="text-red-600 text-sm mb-4">There was a problem securely connecting to the server.</p>
        <button 
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-lg text-red-700 text-sm font-semibold hover:bg-red-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const allStatuses = ['scheduled', 'in-progress', 'completed', 'cancelled'];

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-[#E9ECEF]">
        <button
          onClick={() => setSelectedStatus(null)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
            selectedStatus === null
              ? 'bg-[#2E86AB] text-white border-[#2E86AB] shadow-sm'
              : 'bg-white text-[#495057] border-[#DEE2E6] hover:bg-[#F8F9FA] hover:border-[#CED4DA]'
          }`}
        >
          All Appointments
        </button>
        {allStatuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              selectedStatus === status
                ? 'bg-[#2E86AB] text-white border-[#2E86AB] shadow-sm'
                : 'bg-white text-[#495057] border-[#DEE2E6] hover:bg-[#F8F9FA] hover:border-[#CED4DA]'
            }`}
          >
            {statusConfig[status]?.label || status}
          </button>
        ))}
      </div>

      {/* Appointments Grid */}
      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {appointments.map((apt) => {
            const currentStatus = statusConfig[apt.status] || statusConfig['scheduled'];
            
            return (
              <div key={apt._id} className="bg-white rounded-2xl border border-[#E9ECEF] hover:border-[#CED4DA] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
                
                {/* Card Header */}
                <div className={`px-5 py-4 border-b border-[#E9ECEF] flex items-start justify-between ${currentStatus.bg}`}>
                  <div className="flex-1 pr-3">
                    <h3 className="font-bold text-[#212529] text-base leading-tight mb-1 line-clamp-1" title={apt.title}>{apt.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6C757D] uppercase tracking-wide">
                      <ClipboardList className="w-3.5 h-3.5" />
                      {apt.type || 'Consultation'}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider whitespace-nowrap border ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border}`}>
                    {currentStatus.label}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="space-y-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F8F9FA] flex items-center justify-center border border-[#E9ECEF] flex-shrink-0">
                        <User className="w-4.5 h-4.5 text-[#6C757D]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6C757D] font-medium leading-none mb-1">Patient</p>
                        <p className="text-sm font-bold text-[#212529]">{apt.patientId?.firstName} {apt.patientId?.lastName}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 bg-[#F8F9FA] p-3 rounded-lg border border-[#E9ECEF]">
                      <div>
                         <p className="text-[10px] text-[#6C757D] font-bold uppercase tracking-wide mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Date</p>
                         <p className="text-sm font-semibold text-[#212529]">{new Date(apt.startTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div>
                         <p className="text-[10px] text-[#6C757D] font-bold uppercase tracking-wide mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Time</p>
                         <p className="text-sm font-semibold text-[#212529]">{new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>

                  {apt.description && (
                     <div className="mb-4 text-sm text-[#495057] bg-[#F8F9FA] p-3 rounded-lg border border-[#E9ECEF] line-clamp-2" title={apt.description}>
                       <span className="font-semibold text-[#212529] block mb-0.5 text-xs">Notes:</span>
                       {apt.description}
                     </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-[#E9ECEF]">
                    <div className="flex gap-2">
                       {/* Contextual Actions based on status */}
                       {apt.status === 'scheduled' && (
                         <>
                           <button
                             onClick={() => handleStatusChange(apt._id, 'in-progress')}
                             disabled={isUpdating}
                             className="flex-1 px-3 py-2 text-sm font-semibold bg-[#2E86AB] text-white rounded-xl hover:bg-[#1A5F7A] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                           >
                             Begin Session
                           </button>
                           <button
                             onClick={() => handleStatusChange(apt._id, 'cancelled')}
                             disabled={isUpdating}
                             className="px-3 py-2 text-sm font-semibold bg-white border border-[#DEE2E6] text-[#495057] rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                             aria-label="Cancel Appointment"
                           >
                             <XCircle size={18} />
                           </button>
                         </>
                       )}

                       {apt.status === 'in-progress' && (
                         <>
                           <button
                             onClick={() => handleStatusChange(apt._id, 'completed')}
                             disabled={isUpdating}
                             className="flex-1 px-3 py-2 text-sm font-semibold bg-[#00A896] text-white rounded-xl hover:bg-[#02C39A] transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                           >
                             <CheckCircle2 size={16} /> Complete
                           </button>
                         </>
                       )}

                       {(apt.status === 'completed' || apt.status === 'cancelled') && (
                         <button
                           disabled
                           className="flex-1 px-3 py-2 text-sm font-semibold bg-[#F8F9FA] text-[#A0AEC0] border border-[#E9ECEF] rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                         >
                           {apt.status === 'completed' ? 'Session Completed' : 'Session Cancelled'}
                         </button>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed border-[#DEE2E6] rounded-2xl">
          <Calendar className="w-12 h-12 text-[#CED4DA] mx-auto mb-4" />
          <h3 className="text-[#212529] font-bold text-lg mb-1">No appointments found</h3>
          <p className="text-[#6C757D] text-sm max-w-sm mx-auto">
            {selectedStatus 
              ? `There are no ${statusConfig[selectedStatus]?.label.toLowerCase()} appointments right now.` 
              : "You don't have any appointments scheduled."}
          </p>
          {selectedStatus && (
            <button 
              onClick={() => setSelectedStatus(null)}
              className="mt-4 text-[#2E86AB] font-semibold text-sm hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
