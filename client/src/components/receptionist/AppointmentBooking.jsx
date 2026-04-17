import { useState } from 'react';
import { useBookAppointmentMutation } from '../../services/receptionistApi';
import { AlertCircle, CheckCircle2, Loader2, CalendarPlus } from 'lucide-react';

export default function AppointmentBooking({ defaultDoctorId = '' }) {
  const [bookAppointment] = useBookAppointmentMutation();
  const [form, setForm] = useState({ patientId: '', doctorId: defaultDoctorId, title: '', description: '', startTime: '', endTime: '' });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await bookAppointment(form).unwrap();
      setSuccessMessage('Appointment booked successfully.');
      setForm({ patientId: '', doctorId: defaultDoctorId, title: '', description: '', startTime: '', endTime: '' });
    } catch (err) {
      setErrorMessage(err.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <CalendarPlus className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Book Appointment</h3>
          <p className="text-sm text-gray-500">Reserve a time slot in one pass.</p>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 flex items-start gap-2 text-emerald-800 text-sm">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2 text-red-800 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="patientId" placeholder="Patient ID" value={form.patientId} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
        <input name="doctorId" placeholder="Doctor ID" value={form.doctorId} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 md:col-span-2" />
        <input name="startTime" type="datetime-local" placeholder="Start" value={form.startTime} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
        <input name="endTime" type="datetime-local" placeholder="End" value={form.endTime} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 md:col-span-2" />
      </div>

      <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  );
}
