import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useGetPatientPrescriptionsQuery,
  useLazyDownloadPrescriptionPDFQuery,
  useGetPrescriptionExplanationQuery,
} from '../services/patientApi';
import {
  ArrowLeft,
  Pill,
  Download,
  Brain,
  User,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function PatientPrescriptionsPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [explanationLanguage, setExplanationLanguage] = useState('english');
  const [expandedPrescriptions, setExpandedPrescriptions] = useState(new Set());
  const [downloadPrescriptionPDF, { isLoading: isDownloading }] = useLazyDownloadPrescriptionPDFQuery();

  const { data, isLoading, error } = useGetPatientPrescriptionsQuery({
    status: statusFilter || undefined,
  });

  const {
    data: explanationData,
    isLoading: isLoadingExplanation,
    error: explanationError,
    refetch: refetchExplanation,
  } = useGetPrescriptionExplanationQuery(
    selectedPrescription 
      ? { prescriptionId: selectedPrescription, language: explanationLanguage }
      : null,
    {
      skip: !selectedPrescription,
    }
  );

  const prescriptions = data?.data || [];

  const togglePrescription = (prescriptionId) => {
    const newExpanded = new Set(expandedPrescriptions);
    if (newExpanded.has(prescriptionId)) {
      newExpanded.delete(prescriptionId);
    } else {
      newExpanded.add(prescriptionId);
    }
    setExpandedPrescriptions(newExpanded);
  };

  const handleDownloadPDF = async (prescriptionId) => {
    try {
      await downloadPrescriptionPDF(prescriptionId).unwrap();
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const handleViewExplanation = (prescriptionId, language = 'english') => {
    setSelectedPrescription(prescriptionId);
    setExplanationLanguage(language);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'expired':
        return <XCircle className="text-red-600" size={20} />;
      case 'completed':
        return <CheckCircle className="text-blue-600" size={20} />;
      default:
        return <AlertCircle className="text-yellow-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate('/patient-dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 flex-shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Prescriptions
              </h1>
              <p className="text-xs text-gray-500">View, download, and understand your prescriptions</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filter Section */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Pill size={16} />
              Filter by status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm font-medium transition-all duration-200 hover:border-gray-400"
            >
              <option value="">All Prescriptions</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Pill className="text-green-600" size={24} />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading prescriptions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Failed to Load Prescriptions</h3>
                <p className="text-sm text-red-700">Please try again or contact support if the problem persists.</p>
              </div>
            </div>
          </div>
        )}

        {/* Prescriptions List */}
        {!isLoading && !error && (
          <>
            {prescriptions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center">
                  <Pill className="text-gray-400" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Prescriptions Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {statusFilter
                    ? `You don't have any ${statusFilter} prescriptions. Try selecting a different filter.`
                    : "You don't have any prescriptions yet. Your prescriptions will appear here once prescribed by your doctor."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription, index) => {
                  const isExpanded = expandedPrescriptions.has(prescription._id);
                  const isSelected = selectedPrescription === prescription._id;

                  return (
                    <div
                      key={prescription._id}
                      className="group bg-white rounded-xl shadow-sm border border-gray-200/50 hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Prescription Header */}
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <Pill className="text-green-600" size={24} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                    Prescription #{prescription._id.slice(-6).toUpperCase()}
                                  </h3>
                                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(prescription.status)} border`}>
                                    {getStatusIcon(prescription.status)}
                                    <span className="capitalize">{prescription.status}</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                  {prescription.doctorId && (
                                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                      <User className="text-green-600 flex-shrink-0" size={18} />
                                      <div>
                                        <span className="text-xs text-gray-500 block">Prescribed by</span>
                                        <span className="text-sm font-medium text-gray-900">
                                          Dr. {prescription.doctorId.firstName} {prescription.doctorId.lastName}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                    <Calendar className="text-green-600 flex-shrink-0" size={18} />
                                    <div>
                                      <span className="text-xs text-gray-500 block">Date</span>
                                      <span className="text-sm font-medium text-gray-900">{formatDate(prescription.createdAt)}</span>
                                    </div>
                                  </div>
                                  {prescription.diagnosisId && (
                                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                      <FileText className="text-green-600 flex-shrink-0" size={18} />
                                      <div>
                                        <span className="text-xs text-gray-500 block">Condition</span>
                                        <span className="text-sm font-medium text-gray-900">{prescription.diagnosisId.condition}</span>
                                      </div>
                                    </div>
                                  )}
                                  {prescription.expiresAt && (
                                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                      <Calendar className="text-green-600 flex-shrink-0" size={18} />
                                      <div>
                                        <span className="text-xs text-gray-500 block">Expires</span>
                                        <span className="text-sm font-medium text-gray-900">{formatDate(prescription.expiresAt)}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Medications Summary */}
                                <div className="mb-4">
                                  <p className="text-sm font-semibold text-gray-700 mb-2">Medications:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {prescription.medications.slice(0, 3).map((med, idx) => (
                                      <span
                                        key={idx}
                                        className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                                      >
                                        {med.name}
                                      </span>
                                    ))}
                                    {prescription.medications.length > 3 && (
                                      <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                                        +{prescription.medications.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}
                            >
                              {getStatusIcon(prescription.status)}
                              <span className="capitalize">{prescription.status}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDownloadPDF(prescription._id)}
                                disabled={isDownloading}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                              >
                                {isDownloading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span>Downloading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Download size={16} />
                                    <span>Download PDF</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => togglePrescription(prescription._id)}
                                className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                              >
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 animate-fade-in-up">
                          <div className="space-y-6">
                            {/* Full Medications List */}
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Pill className="text-green-600" size={22} />
                                Medications Details
                              </h4>
                              <div className="space-y-3">
                                {prescription.medications.map((med, idx) => (
                                  <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                                    <h5 className="font-bold text-gray-900 mb-3 text-lg">{med.name}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                      <div className="p-2 bg-blue-50 rounded-lg">
                                        <span className="text-xs text-gray-600 block mb-1">Dosage</span>
                                        <span className="text-sm font-semibold text-gray-900">{med.dosage}</span>
                                      </div>
                                      <div className="p-2 bg-green-50 rounded-lg">
                                        <span className="text-xs text-gray-600 block mb-1">Frequency</span>
                                        <span className="text-sm font-semibold text-gray-900">{med.frequency}</span>
                                      </div>
                                      <div className="p-2 bg-purple-50 rounded-lg">
                                        <span className="text-xs text-gray-600 block mb-1">Duration</span>
                                        <span className="text-sm font-semibold text-gray-900">{med.duration}</span>
                                      </div>
                                    </div>
                                    {med.instructions && (
                                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-700">
                                          <span className="font-semibold text-gray-900">Instructions:</span> {med.instructions}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* General Instructions */}
                            {prescription.instructions && (
                              <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                  <FileText className="text-blue-600" size={22} />
                                  General Instructions
                                </h4>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                                  <p className="text-gray-700 leading-relaxed">{prescription.instructions}</p>
                                </div>
                              </div>
                            )}

                            {/* Additional Notes */}
                            {prescription.notes && (
                              <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                  <FileText className="text-purple-600" size={22} />
                                  Additional Notes
                                </h4>
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                                  <p className="text-gray-700 leading-relaxed">{prescription.notes}</p>
                                </div>
                              </div>
                            )}

                            {/* Refills */}
                            {prescription.refillsAllowed > 0 && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                  <span className="font-medium">Refills Allowed:</span> {prescription.refillsAllowed}
                                </p>
                              </div>
                            )}

                            {/* AI Explanation */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                  <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-50 rounded-lg">
                                    <Brain className="text-purple-600" size={22} />
                                  </div>
                                  AI-Generated Explanation
                                </h4>
                                {!isSelected && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleViewExplanation(prescription._id, 'english')}
                                      className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                      English
                                    </button>
                                    <button
                                      onClick={() => handleViewExplanation(prescription._id, 'urdu')}
                                      className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                      اردو (Urdu)
                                    </button>
                                  </div>
                                )}
                              </div>

                              {isSelected && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                  {/* Language Toggle */}
                                  <div className="flex gap-2 mb-4">
                                    <button
                                      onClick={() => handleViewExplanation(prescription._id, 'english')}
                                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                        explanationLanguage === 'english'
                                          ? 'bg-purple-600 text-white'
                                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                      }`}
                                    >
                                      English
                                    </button>
                                    <button
                                      onClick={() => handleViewExplanation(prescription._id, 'urdu')}
                                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                        explanationLanguage === 'urdu'
                                          ? 'bg-purple-600 text-white'
                                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                      }`}
                                    >
                                      اردو (Urdu)
                                    </button>
                                  </div>

                                  {isLoadingExplanation ? (
                                    <div className="flex items-center justify-center py-8">
                                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                    </div>
                                  ) : explanationError ? (
                                    <div className="text-red-600">
                                      Failed to generate explanation. Please try again.
                                    </div>
                                  ) : explanationData?.data?.explanation ? (
                                    <div className="prose max-w-none">
                                      <p className={`text-gray-700 whitespace-pre-line ${
                                        explanationLanguage === 'urdu' ? 'text-right' : 'text-left'
                                      }`}>
                                        {explanationData.data.explanation}
                                      </p>
                                      {explanationData.data.note && (
                                        <p className="text-sm text-gray-500 mt-2 italic">
                                          {explanationData.data.note}
                                        </p>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

