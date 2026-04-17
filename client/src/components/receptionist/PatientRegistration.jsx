import { useState } from 'react';
import { useRegisterPatientMutation } from '../../services/receptionistApi';
import { AlertCircle, CheckCircle2, Loader2, UserPlus } from 'lucide-react';

export default function PatientRegistration() {
  const [registerPatient] = useRegisterPatientMutation();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', dob: '' });
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
      await registerPatient(form).unwrap();
      setSuccessMessage('Patient registered successfully.');
      setForm({ firstName: '', lastName: '', email: '', password: '', phone: '', dob: '' });
    } catch (err) {
      setErrorMessage(err.data?.message || 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Register New Patient</h3>
          <p className="text-sm text-gray-500">Create a secure patient portal account.</p>
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
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 md:col-span-2" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 md:col-span-2" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        <input name="dob" type="date" placeholder="DOB" value={form.dob} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
      </div>

      <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {loading ? 'Registering...' : 'Register Patient'}
      </button>
    </form>
  );
}
