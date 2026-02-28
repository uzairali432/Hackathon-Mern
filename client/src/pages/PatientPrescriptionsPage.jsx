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
  const [expandedPrescriptions, setExpandedPrescriptions] = useState(new Set());
  const [downloadPrescriptionPDF, { isLoading: isDownloading }] = useLazyDownloadPrescriptionPDFQuery();

  const { data, isLoading, error } = useGetPatientPrescriptionsQuery({
    status: statusFilter || undefined,
  });

  const {
    data: explanationData,
    isLoading: isLoadingExplanation,
    error: explanationError,
  } = useGetPrescriptionExplanationQuery(selectedPrescription, {
    skip: !selectedPrescription,
  });

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

  const handleViewExplanation = (prescriptionId) => {
    setSelectedPrescription(prescriptionId);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate('/patient-dashboard')}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Prescriptions</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Failed to load prescriptions. Please try again.</p>
          </div>
        )}

        {/* Prescriptions List */}
        {!isLoading && !error && (
          <>
            {prescriptions.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Pill className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prescriptions Found</h3>
                <p className="text-gray-600">
                  {statusFilter
                    ? `You don't have any ${statusFilter} prescriptions.`
                    : "You don't have any prescriptions yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => {
                  const isExpanded = expandedPrescriptions.has(prescription._id);
                  const isSelected = selectedPrescription === prescription._id;

                  return (
                    <div
                      key={prescription._id}
                      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      {/* Prescription Header */}
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="p-3 bg-green-100 rounded-full">
                                <Pill className="text-green-600" size={24} />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                  Prescription #{prescription._id.slice(-6).toUpperCase()}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  {prescription.doctorId && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                      <User size={18} />
                                      <span className="font-medium">Prescribed by:</span>
                                      <span>
                                        Dr. {prescription.doctorId.firstName} {prescription.doctorId.lastName}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <Calendar size={18} />
                                    <span className="font-medium">Date:</span>
                                    <span>{formatDate(prescription.createdAt)}</span>
                                  </div>
                                  {prescription.diagnosisId && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                      <FileText size={18} />
                                      <span className="font-medium">Condition:</span>
                                      <span>{prescription.diagnosisId.condition}</span>
                                    </div>
                                  )}
                                  {prescription.expiresAt && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                      <Calendar size={18} />
                                      <span className="font-medium">Expires:</span>
                                      <span>{formatDate(prescription.expiresAt)}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Medications Summary */}
                                <div className="mb-4">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Medications:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {prescription.medications.slice(0, 3).map((med, idx) => (
                                      <span
                                        key={idx}
                                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                                      >
                                        {med.name}
                                      </span>
                                    ))}
                                    {prescription.medications.length > 3 && (
                                      <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm">
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
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
                              >
                                <Download size={16} />
                                {isDownloading ? 'Downloading...' : 'Download PDF'}
                              </button>
                              <button
                                onClick={() => togglePrescription(prescription._id)}
                                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                              >
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-6 bg-gray-50">
                          <div className="space-y-6">
                            {/* Full Medications List */}
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">Medications Details</h4>
                              <div className="space-y-4">
                                {prescription.medications.map((med, idx) => (
                                  <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h5 className="font-semibold text-gray-900 mb-2">{med.name}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700">
                                      <div>
                                        <span className="font-medium">Dosage:</span> {med.dosage}
                                      </div>
                                      <div>
                                        <span className="font-medium">Frequency:</span> {med.frequency}
                                      </div>
                                      <div>
                                        <span className="font-medium">Duration:</span> {med.duration}
                                      </div>
                                    </div>
                                    {med.instructions && (
                                      <p className="mt-2 text-sm text-gray-600">
                                        <span className="font-medium">Instructions:</span> {med.instructions}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* General Instructions */}
                            {prescription.instructions && (
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">General Instructions</h4>
                                <p className="text-gray-700 bg-white rounded-lg p-4 border border-gray-200">
                                  {prescription.instructions}
                                </p>
                              </div>
                            )}

                            {/* Additional Notes */}
                            {prescription.notes && (
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Additional Notes</h4>
                                <p className="text-gray-700 bg-white rounded-lg p-4 border border-gray-200">
                                  {prescription.notes}
                                </p>
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
                                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                  <Brain className="text-purple-600" size={20} />
                                  AI-Generated Explanation
                                </h4>
                                {!isSelected && (
                                  <button
                                    onClick={() => handleViewExplanation(prescription._id)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium transition-colors"
                                  >
                                    Generate Explanation
                                  </button>
                                )}
                              </div>

                              {isSelected && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
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
                                      <p className="text-gray-700 whitespace-pre-line">
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

