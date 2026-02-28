import { useGetDoctorAppointmentsQuery, useUpdateAppointmentStatusMutation } from "../../services/doctorApi";
import { Calendar, Clock, MapPin, User, Check, X } from 'lucide-react';
import { useState } from 'react';

export default function AppointmentsList() {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const { data, isLoading, error } = useGetDoctorAppointmentsQuery({ status: selectedStatus });
  const [updateStatus] = useUpdateAppointmentStatusMutation();

  const appointments = data?.data || [];

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateStatus({ appointmentId, status: newStatus }).unwrap();
    } catch (err) {
      alert('Failed to update appointment status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['scheduled', 'in-progress', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Appointments Grid */}
      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((apt) => (
            <div key={apt._id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{apt.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{apt.type}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : apt.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : apt.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{apt.patientId?.firstName} {apt.patientId?.lastName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(apt.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {apt.description && <p className="text-sm text-gray-600 border-t pt-2">{apt.description}</p>}

              {/* Status Change Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                {apt.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange(apt._id, 'completed')}
                    className="flex-1 px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Check size={14} /> Complete
                  </button>
                )}
                {apt.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusChange(apt._id, 'cancelled')}
                    className="flex-1 px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <X size={14} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No appointments found</p>
        </div>
      )}
    </div>
  );
}
