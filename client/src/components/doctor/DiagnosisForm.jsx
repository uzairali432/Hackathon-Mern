import { useState } from 'react';
import { useAddDiagnosisMutation } from "../../services/doctorApi";
import { AlertCircle } from 'lucide-react';

export default function DiagnosisForm({ appointmentId, patientId, onSuccess }) {
  const [addDiagnosis] = useAddDiagnosisMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    condition: '',
    severity: 'mild',
    description: '',
    aiSuggestion: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await addDiagnosis({
        appointmentId,
        patientId,
        ...formData,
      }).unwrap();

      // Reset form
      setFormData({
        condition: '',
        severity: 'mild',
        description: '',
        aiSuggestion: '',
        notes: '',
      });

      alert('Diagnosis added successfully');
      onSuccess?.();
    } catch (err) {
      setError(err.data?.message || 'Failed to add diagnosis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Add Diagnosis</h3>

      {error && (
        <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Appointment ID (readonly) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
        <input
          type="text"
          value={appointmentId}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
        />
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Condition <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          placeholder="e.g., Hypertension, Diabetes, Common Cold"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Severity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
        <select
          name="severity"
          value={formData.severity}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed diagnosis description and clinical findings"
          required
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* AI Suggestion */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">AI Suggestion (Optional)</label>
        <textarea
          name="aiSuggestion"
          value={formData.aiSuggestion}
          onChange={handleChange}
          placeholder="AI-assisted diagnosis suggestions"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional clinical notes"
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Adding Diagnosis...' : 'Add Diagnosis'}
      </button>
    </form>
  );
}
