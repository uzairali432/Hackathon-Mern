import { useState } from 'react';
import { useBookAppointmentMutation } from '../../services/receptionistApi';

export default function AppointmentBooking({ defaultDoctorId = '' }) {
  const [bookAppointment] = useBookAppointmentMutation();
  const [form, setForm] = useState({ patientId: '', doctorId: defaultDoctorId, title: '', description: '', startTime: '', endTime: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookAppointment(form).unwrap();
      alert('Appointment booked');
      setForm({ patientId: '', doctorId: defaultDoctorId, title: '', description: '', startTime: '', endTime: '' });
    } catch (err) {
      alert(err.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold">Book Appointment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="patientId" placeholder="Patient ID" value={form.patientId} onChange={handleChange} className="px-3 py-2 border rounded" />
        <input name="doctorId" placeholder="Doctor ID" value={form.doctorId} onChange={handleChange} className="px-3 py-2 border rounded" />
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="px-3 py-2 border rounded" />
        <input name="startTime" type="datetime-local" placeholder="Start" value={form.startTime} onChange={handleChange} className="px-3 py-2 border rounded" />
        <input name="endTime" type="datetime-local" placeholder="End" value={form.endTime} onChange={handleChange} className="px-3 py-2 border rounded" />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="px-3 py-2 border rounded" />
      </div>
      <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? 'Booking...' : 'Book'}</button>
    </form>
  );
}
