import { useState } from 'react';
import { useWritePrescriptionMutation } from "../../services/doctorApi";
import { AlertCircle, Plus, X } from 'lucide-react';

export default function PrescriptionForm({ patientId, diagnosisId, onSuccess }) {
  const [writePrescription] = useWritePrescriptionMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [medications, setMedications] = useState([
    {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    },
  ]);

  const [formData, setFormData] = useState({
    instructions: '',
    refillsAllowed: 0,
  });

  const handleMedicationChange = (index, field, value) => {
    const newMeds = [...medications];
    newMeds[index][field] = value;
    setMedications(newMeds);
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ]);
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'refillsAllowed' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate medications
    if (medications.some((m) => !m.name || !m.dosage || !m.frequency || !m.duration)) {
      setError('All medication fields are required');
      return;
    }

    setLoading(true);

    try {
      await writePrescription({
        diagnosisId,
        patientId,
        medications,
        instructions: formData.instructions,
        refillsAllowed: formData.refillsAllowed,
      }).unwrap();

      // Reset form
      setMedications([
        {
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
        },
      ]);
      setFormData({ instructions: '', refillsAllowed: 0 });

      alert('Prescription written successfully');
      onSuccess?.();
    } catch (err) {
      setError(err.data?.message || 'Failed to write prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Write Prescription</h3>

      {error && (
        <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Medications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Medications</h4>
          <button
            type="button"
            onClick={addMedication}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> Add Medication
          </button>
        </div>

        {medications.map((med, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium text-gray-900">Medication {index + 1}</p>
              {medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Medication Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medicine Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={med.name}
                onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                placeholder="e.g., Paracetamol, Amoxicillin"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Grid for dosage, frequency, duration */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  placeholder="500mg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={med.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  placeholder="Twice daily"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={med.duration}
                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                  placeholder="7 days"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions (Optional)</label>
              <input
                type="text"
                value={med.instructions}
                onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                placeholder="Take with food, avoid dairy, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* General Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          General Instructions <span className="text-red-600">*</span>
        </label>
        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          placeholder="e.g., Take one tablet with water in morning and evening. Avoid alcohol. Consult if side effects occur."
          required
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Refills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Refills Allowed</label>
        <input
          type="number"
          name="refillsAllowed"
          value={formData.refillsAllowed}
          onChange={handleChange}
          min="0"
          max="10"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Writing Prescription...' : 'Write Prescription'}
      </button>
    </form>
  );
}
