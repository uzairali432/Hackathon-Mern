import { useState } from 'react';
import { useRegisterPatientMutation } from '../../services/receptionistApi';

export default function PatientRegistration() {
  const [registerPatient] = useRegisterPatientMutation();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', dob: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerPatient(form).unwrap();
      alert('Patient registered successfully');
      setForm({ firstName: '', lastName: '', email: '', password: '', phone: '', dob: '' });
    } catch (err) {
      alert(err.data?.message || 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold">Register New Patient</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} className="px-3 py-2 border rounded" />
        <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} className="px-3 py-2 border rounded" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="px-3 py-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="px-3 py-2 border rounded" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="px-3 py-2 border rounded" />
        <input name="dob" type="date" placeholder="DOB" value={form.dob} onChange={handleChange} className="px-3 py-2 border rounded" />
      </div>
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Registering...' : 'Register'}</button>
    </form>
  );
}
