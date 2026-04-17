import { useState } from 'react';
import { useGetDailyScheduleQuery, useUpdateAppointmentMutation } from '../../services/receptionistApi';
import { AlertCircle, CheckCircle2, CalendarClock, Loader2, RefreshCw } from 'lucide-react';

export default function DailySchedule() {
  const [date, setDate] = useState('');
  const { data, isLoading, refetch } = useGetDailyScheduleQuery(date || undefined);
  const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation();
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const schedule = data?.data || [];

  const handleStatusChange = async (appointmentId, status) => {
    setMessage('');
    setErrorMessage('');
    try {
      await updateAppointment({ appointmentId, status }).unwrap();
      setMessage('Appointment updated successfully.');
      refetch();
    } catch (err) {
      setErrorMessage(err.data?.message || 'Failed to update appointment');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Daily Schedule</h3>
            <p className="text-sm text-gray-500">Track the clinic's live appointment queue.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full sm:w-auto px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          <button onClick={() => refetch()} className="px-3 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Load
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 flex items-start gap-2 text-emerald-800 text-sm">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2 text-red-800 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 rounded-2xl bg-gray-100 border border-gray-200" />
          ))}
        </div>
      ) : schedule.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-700 font-medium">No appointments for the selected date.</p>
          <p className="text-sm text-gray-500 mt-1">Try another date or load today's schedule.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.map((apt) => (
            <div key={apt._id} className="border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">{apt.title} - {apt.patientId?.firstName} {apt.patientId?.lastName}</p>
                <p className="text-sm text-gray-500">{new Date(apt.startTime).toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="capitalize px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{apt.status}</span>
                {apt.status !== 'completed' && (
                  <button disabled={isUpdating} onClick={() => handleStatusChange(apt._id, 'completed')} className="px-3 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-sm font-medium hover:bg-emerald-200 transition-colors disabled:opacity-60">
                    Complete
                  </button>
                )}
                {apt.status !== 'cancelled' && (
                  <button disabled={isUpdating} onClick={() => handleStatusChange(apt._id, 'cancelled')} className="px-3 py-2 bg-red-100 text-red-800 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-60">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
