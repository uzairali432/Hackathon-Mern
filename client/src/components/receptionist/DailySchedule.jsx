import { useState } from 'react';
import { useGetDailyScheduleQuery, useUpdateAppointmentMutation } from '../../services/receptionistApi';

export default function DailySchedule() {
  const [date, setDate] = useState('');
  const { data, isLoading, refetch } = useGetDailyScheduleQuery(date || undefined);
  const [updateAppointment] = useUpdateAppointmentMutation();

  const schedule = data?.data || [];

  const handleStatusChange = async (appointmentId, status) => {
    try {
      await updateAppointment({ appointmentId, status }).unwrap();
      alert('Appointment updated');
      refetch();
    } catch (err) {
      alert('Failed to update appointment');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Daily Schedule</h3>
        <div className="flex items-center gap-2">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 border rounded" />
          <button onClick={() => refetch()} className="px-3 py-2 bg-blue-600 text-white rounded">Load</button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : schedule.length === 0 ? (
        <p className="text-gray-500">No appointments for selected date</p>
      ) : (
        <div className="space-y-3">
          {schedule.map((apt) => (
            <div key={apt._id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{apt.title} - {apt.patientId?.firstName} {apt.patientId?.lastName}</p>
                <p className="text-sm text-gray-600">{new Date(apt.startTime).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="capitalize px-2 py-1 rounded text-sm bg-gray-100">{apt.status}</span>
                {apt.status !== 'completed' && (
                  <button onClick={() => handleStatusChange(apt._id, 'completed')} className="px-2 py-1 bg-green-100 rounded">Complete</button>
                )}
                {apt.status !== 'cancelled' && (
                  <button onClick={() => handleStatusChange(apt._id, 'cancelled')} className="px-2 py-1 bg-red-100 rounded">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
