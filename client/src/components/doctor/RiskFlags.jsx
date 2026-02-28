import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Activity, Pill, Calendar } from 'lucide-react';
import axios from 'axios';

export default function RiskFlags({ patientId }) {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (patientId) {
      fetchRiskFlags();
    }
  }, [patientId]);

  const fetchRiskFlags = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:5000/api/v1/doctors/patient/${patientId}/risk-flags`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRiskData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load risk flags');
      console.error('Risk flags error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!patientId) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!riskData || !riskData.flags || riskData.flags.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Activity className="text-green-600" size={20} />
          <p className="text-green-800 font-medium">No Risk Flags Detected</p>
        </div>
        <p className="text-sm text-green-700 mt-1">{riskData?.summary || 'Patient health patterns appear normal.'}</p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'medium':
        return 'bg-orange-50 border-orange-300 text-orange-800';
      default:
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
    }
  };

  const getFlagIcon = (type) => {
    switch (type) {
      case 'repeated_infection':
        return <TrendingUp size={20} />;
      case 'chronic_symptom':
        return <Activity size={20} />;
      case 'high_frequency_visits':
        return <Calendar size={20} />;
      case 'multiple_prescriptions':
        return <Pill size={20} />;
      default:
        return <AlertTriangle size={20} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="text-orange-600" size={24} />
          <h4 className="text-lg font-semibold text-orange-900">Risk Analysis Summary</h4>
        </div>
        <p className="text-sm text-orange-800">{riskData.summary}</p>
      </div>

      {/* Risk Flags */}
      <div className="space-y-3">
        {riskData.flags.map((flag, idx) => (
          <div
            key={idx}
            className={`border-2 rounded-lg p-4 ${getSeverityColor(flag.severity)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getFlagIcon(flag.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold capitalize">
                    {flag.type.replace('_', ' ')}
                  </h5>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    flag.severity === 'high' ? 'bg-red-200 text-red-900' :
                    flag.severity === 'medium' ? 'bg-orange-200 text-orange-900' :
                    'bg-yellow-200 text-yellow-900'
                  }`}>
                    {flag.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm mb-2">{flag.message}</p>
                {flag.recommendation && (
                  <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                    <p className="text-xs font-medium">Recommendation:</p>
                    <p className="text-xs mt-1">{flag.recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Analysis */}
      {riskData.aiAnalysis && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-semibold text-blue-900 mb-2">AI Analysis</h5>
          <p className="text-sm text-blue-800 whitespace-pre-line">
            {riskData.aiAnalysis.assessment}
          </p>
        </div>
      )}
    </div>
  );
}

