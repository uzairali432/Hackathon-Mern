import { useState } from 'react';
import { Lightbulb, AlertCircle, Search, FileText } from 'lucide-react';
import axios from 'axios';

export default function AIAssistance({ patientId = null }) {
  const [symptoms, setSymptoms] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [patientIdInput, setPatientIdInput] = useState(patientId || '');
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
          patientId: patientIdInput || null,
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 space-y-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-yellow-100 to-amber-50 rounded-xl">
          <Lightbulb size={24} className="text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Smart Symptom Checker</h3>
          <p className="text-sm text-gray-600">
            Enhanced AI-assisted diagnosis with patient history, risk levels, and suggested tests
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGetSuggestions} className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
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

        {/* Patient ID (Optional - for history) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID (Optional - for history analysis)</label>
          <input
            type="text"
            value={patientIdInput}
            onChange={(e) => setPatientIdInput(e.target.value)}
            placeholder="Enter patient ID to include medical history"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Include patient history for better AI analysis</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Search size={18} />
              <span>Get AI Suggestions</span>
            </>
          )}
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

      {/* Risk Level */}
      {suggestions?.riskLevel && (
        <div className={`p-5 rounded-xl border-2 shadow-sm animate-fade-in-up ${
          suggestions.riskLevel === 'Critical' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300' :
          suggestions.riskLevel === 'High' ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300' :
          suggestions.riskLevel === 'Medium' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300' :
          'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              suggestions.riskLevel === 'Critical' ? 'bg-red-100' :
              suggestions.riskLevel === 'High' ? 'bg-orange-100' :
              suggestions.riskLevel === 'Medium' ? 'bg-yellow-100' :
              'bg-green-100'
            }`}>
              <AlertCircle size={24} className={
                suggestions.riskLevel === 'Critical' ? 'text-red-600' :
                suggestions.riskLevel === 'High' ? 'text-orange-600' :
                suggestions.riskLevel === 'Medium' ? 'text-yellow-600' :
                'text-green-600'
              } />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Risk Assessment</p>
              <h4 className="text-xl font-bold text-gray-900 capitalize">{suggestions.riskLevel}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Tests */}
      {suggestions?.suggestedTests && suggestions.suggestedTests.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            Suggested Diagnostic Tests
          </h4>
          <ul className="space-y-2">
            {suggestions.suggestedTests.map((test, idx) => (
              <li key={idx} className="flex items-start gap-3 p-2 bg-white rounded-lg">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span className="text-sm text-gray-700 font-medium">{test}</span>
              </li>
            ))}
          </ul>
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
