import { useState } from 'react';
import { Lightbulb, AlertCircle, Search } from 'lucide-react';
import axios from 'axios';

export default function AIAssistance() {
  const [symptoms, setSymptoms] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetSuggestions = async (e) => {
    e.preventDefault();
    setError('');
    setSuggestions(null);

    if (!symptoms.trim()) {
      setError('Please enter symptoms');
      return;
    }

    setLoading(true);

    try {
      const symptomsArray = symptoms
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);

      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:5000/api/v1/doctors/ai-assistance',
        {
          symptoms: symptomsArray,
          patientAge: patientAge || null,
          patientGender: patientGender || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuggestions(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-1">
          <Lightbulb size={20} className="text-yellow-600" /> AI Diagnosis Assistance
        </h3>
        <p className="text-sm text-gray-600">
          Get AI-assisted diagnosis suggestions based on patient symptoms
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGetSuggestions} className="space-y-4 bg-blue-50 p-4 rounded-lg">
        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Symptoms <span className="text-red-600">*</span>
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Enter symptoms separated by commas. E.g., fever, cough, sore throat"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple symptoms with commas</p>
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age (Optional)</label>
            <input
              type="number"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              placeholder="e.g., 45"
              min="0"
              max="150"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender (Optional)</label>
            <select
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          <Search size={16} />
          {loading ? 'Analyzing...' : 'Get AI Suggestions'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Disclaimer */}
      {suggestions && (
        <div className="flex gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <p>{suggestions.disclaimer}</p>
        </div>
      )}

      {/* Warnings */}
      {suggestions?.warnings && suggestions.warnings.length > 0 && (
        <div className="space-y-2">
          {suggestions.warnings.map((warning, idx) => (
            <div key={idx} className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <p>{warning}</p>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {suggestions?.suggestions && suggestions.suggestions.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Possible Diagnoses:</h4>
          {suggestions.suggestions.map((suggestion, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-semibold text-gray-900">{suggestion.condition}</h5>
                  <p className="text-sm text-gray-600">{suggestion.icdCode && `(ICD Code: ${suggestion.icdCode})`}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {suggestion.confidence}
                </span>
              </div>

              {/* Recommendations */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {suggestion.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!suggestions && !loading && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Lightbulb size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">Enter symptoms to get AI-assisted diagnosis suggestions</p>
        </div>
      )}
    </div>
  );
}
