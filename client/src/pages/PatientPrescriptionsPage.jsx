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
  Clock,
  ShieldCheck,
  Languages
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
        return <CheckCircle className="w-4 h-4 text-[#28A745]" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-[#DC3545]" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-[#2E86AB]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[#F59E0B]" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-[#155724] border-green-200';
      case 'expired':
        return 'bg-red-50 text-[#721C24] border-red-200';
      case 'completed':
        return 'bg-blue-50 text-[#0C5460] border-blue-200';
      default:
        return 'bg-orange-50 text-[#856404] border-orange-200';
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
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] font-['Inter'] selection:bg-teal-100 selection:text-teal-900 pb-12">
      
      {/* Header */}
      <nav className="bg-white border-b border-[#E9ECEF] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/patient-dashboard')}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2E86AB] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-[#212529]">My Prescriptions</h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] rounded-full border border-[#E9ECEF] text-xs font-semibold text-[#6C757D]">
              <ShieldCheck className="w-4 h-4 text-[#00A896]" />
              Pharmacy Verified
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-5xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-[#495057] flex items-center gap-2">
              <Pill className="w-4 h-4 text-[#A0AEC0]" />
              Filter Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#DEE2E6] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] bg-white text-[#212529] min-w-[160px]"
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
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00A896]/20 border-t-[#00A896]"></div>
            </div>
            <p className="mt-4 text-[#6C757D] font-medium">Loading prescriptions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-red-100">
              <AlertCircle className="w-5 h-5 text-[#DC3545]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#DC3545] text-lg mb-1">Failed to connect</h3>
              <p className="text-red-900/70 text-sm">We couldn't load your prescriptions. Please check your connection and try again.</p>
            </div>
          </div>
        )}

        {/* Prescriptions List */}
        {!isLoading && !error && (
          <>
            {prescriptions.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-16 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-6 border border-[#E9ECEF]">
                  <Pill className="w-10 h-10 text-[#A0AEC0]" />
                </div>
                <h3 className="text-xl font-bold text-[#212529] mb-2">No Prescriptions Found</h3>
                <p className="text-[#6C757D] max-w-sm">
                  {statusFilter
                    ? `You don't have any ${statusFilter} prescriptions matching your criteria.`
                    : "You don't have any prescriptions yet. Your prescriptions will appear here once prescribed."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {prescriptions.map((prescription) => {
                  const isExpanded = expandedPrescriptions.has(prescription._id);
                  const isSelected = selectedPrescription === prescription._id;

                  return (
                    <div
                      key={prescription._id}
                      className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Prescription Main Info Card */}
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                          
                          <div className="flex items-start gap-4 flex-1">
                            {/* Icon */}
                            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-teal-50 items-center justify-center flex-shrink-0 border border-teal-100">
                              <Pill className="w-7 h-7 text-[#00A896]" />
                            </div>
                            
                            <div className="flex-1 w-full">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg sm:text-xl font-bold text-[#212529]">
                                      Rx #{prescription._id.slice(-8).toUpperCase()}
                                    </h3>
                                    <div className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold border flex items-center gap-1 uppercase tracking-wider ${getStatusStyle(prescription.status)}`}>
                                      {getStatusIcon(prescription.status)}
                                      {prescription.status}
                                    </div>
                                  </div>
                                  <p className="text-sm font-medium text-[#6C757D] flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" /> Issued on {formatDate(prescription.createdAt)}
                                  </p>
                                </div>
                              </div>

                              {/* Summary Info */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                                {prescription.doctorId && (
                                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E9ECEF]">
                                    <User className="w-4 h-4 text-[#2E86AB]" />
                                    <div className="overflow-hidden">
                                      <span className="text-[10px] text-[#868E96] font-bold uppercase tracking-wider block leading-none mb-0.5">Prescribed By</span>
                                      <span className="text-sm font-semibold text-[#212529] truncate block">Dr. {prescription.doctorId.firstName} {prescription.doctorId.lastName}</span>
                                    </div>
                                  </div>
                                )}
                                {prescription.diagnosisId && (
                                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E9ECEF]">
                                    <FileText className="w-4 h-4 text-[#2E86AB]" />
                                    <div className="overflow-hidden">
                                      <span className="text-[10px] text-[#868E96] font-bold uppercase tracking-wider block leading-none mb-0.5">Diagnosis</span>
                                      <span className="text-sm font-semibold text-[#212529] truncate block">{prescription.diagnosisId.condition}</span>
                                    </div>
                                  </div>
                                )}
                                {prescription.expiresAt && (
                                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E9ECEF]">
                                    <Clock className="w-4 h-4 text-[#2E86AB]" />
                                    <div className="overflow-hidden">
                                      <span className="text-[10px] text-[#868E96] font-bold uppercase tracking-wider block leading-none mb-0.5">Expires</span>
                                      <span className="text-sm font-semibold text-[#212529] truncate block">{formatDate(prescription.expiresAt)}</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Medication Quick List */}
                              <div>
                                <p className="text-xs font-semibold text-[#868E96] uppercase tracking-wider mb-2">Primary Medications</p>
                                <div className="flex flex-wrap gap-2">
                                  {prescription.medications.slice(0, 3).map((med, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-white border border-[#DEE2E6] text-[#212529] rounded-lg text-sm font-semibold shadow-sm flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]"></span>
                                      {med.name}
                                    </span>
                                  ))}
                                  {prescription.medications.length > 3 && (
                                    <span className="px-3 py-1.5 bg-[#F8F9FA] text-[#6C757D] rounded-lg text-sm font-semibold border border-[#E9ECEF]">
                                      +{prescription.medications.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Actions */}
                          <div className="flex flex-row md:flex-col items-center md:items-end gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-[#E9ECEF] md:border-0">
                            <button
                              onClick={() => handleDownloadPDF(prescription._id)}
                              disabled={isDownloading}
                              className="flex-1 md:w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#DEE2E6] bg-white text-[#495057] rounded-xl hover:bg-[#F8F9FA] disabled:opacity-50 text-sm font-semibold transition-colors focus:ring-4 focus:ring-[#E9ECEF]"
                            >
                              {isDownloading ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                              <span>Download</span>
                            </button>
                            <button
                              onClick={() => togglePrescription(prescription._id)}
                              className="flex-1 md:w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00A896] text-white rounded-xl hover:bg-[#028F7E] text-sm font-semibold transition-colors focus:ring-4 focus:ring-[#00A896]/30 shadow-sm"
                            >
                              <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content View */}
                      {isExpanded && (
                        <div className="border-t border-[#E9ECEF] bg-[#F8F9FA] p-6 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Left Col: Medication List */}
                            <div className="lg:col-span-2 space-y-6">
                              <h4 className="text-lg font-bold text-[#212529] flex items-center gap-2 border-b border-[#E9ECEF] pb-3">
                                <Pill className="w-5 h-5 text-[#00A896]" />
                                Prescribed Medications
                              </h4>
                              
                              <div className="space-y-4">
                                {prescription.medications.map((med, idx) => (
                                  <div key={idx} className="bg-white rounded-xl p-5 border border-[#E9ECEF] shadow-sm">
                                    <h5 className="font-bold text-[#212529] text-lg mb-4">{med.name}</h5>
                                    
                                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                                      <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
                                        <span className="text-[10px] text-teal-800 font-bold uppercase tracking-wider block mb-1">Dosage</span>
                                        <span className="text-sm font-bold text-teal-900">{med.dosage}</span>
                                      </div>
                                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider block mb-1">Frequency</span>
                                        <span className="text-sm font-bold text-blue-900">{med.frequency}</span>
                                      </div>
                                      <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                                        <span className="text-[10px] text-purple-800 font-bold uppercase tracking-wider block mb-1">Duration</span>
                                        <span className="text-sm font-bold text-purple-900">{med.duration}</span>
                                      </div>
                                    </div>

                                    {med.instructions && (
                                      <div className="pt-3 border-t border-[#E9ECEF]">
                                        <p className="text-sm text-[#495057]">
                                          <span className="font-bold text-[#212529]">Take with:</span> {med.instructions}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* General Instructions */}
                              {prescription.instructions && (
                                <div className="bg-[#2E86AB]/5 rounded-xl p-5 border border-[#2E86AB]/20 mt-6">
                                  <h4 className="text-sm font-bold text-[#2E86AB] mb-2 uppercase tracking-wide">Doctor's General Instructions</h4>
                                  <p className="text-[#495057] text-sm leading-relaxed">{prescription.instructions}</p>
                                </div>
                              )}
                            </div>

                            {/* Right Col: AI & Extras */}
                            <div className="space-y-6">
                               
                               {/* Refills */}
                               <div className="bg-white rounded-xl p-5 border border-[#E9ECEF] shadow-sm flex items-center justify-between">
                                  <div>
                                    <span className="text-xs font-bold text-[#868E96] uppercase tracking-wider block mb-1">Available Refills</span>
                                    <span className="text-2xl font-black text-[#212529]">{prescription.refillsAllowed || 0}</span>
                                  </div>
                                  <div className="w-12 h-12 rounded-full bg-[#F8F9FA] flex items-center justify-center border border-[#E9ECEF]">
                                    <Pill className="w-6 h-6 text-[#A0AEC0]" />
                                  </div>
                               </div>

                               {/* AI Explanation Tool */}
                               <div className="bg-white rounded-xl p-5 border border-[#E9ECEF] shadow-sm">
                                 <h4 className="text-sm font-bold text-[#212529] flex items-center gap-2 mb-3">
                                   <Brain className="w-4 h-4 text-[#A23B72]" />
                                   AI Explanation
                                 </h4>
                                 <p className="text-xs text-[#6C757D] mb-4">
                                   Use MedConnect AI to generate a patient-friendly breakdown of this prescription.
                                 </p>
                                 
                                 {!isSelected ? (
                                   <div className="flex flex-col gap-2">
                                     <button
                                       onClick={() => handleViewExplanation(prescription._id, 'english')}
                                       className="w-full px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between"
                                     >
                                       <span>Explain in English</span>
                                       <Languages className="w-4 h-4" />
                                     </button>
                                     <button
                                       onClick={() => handleViewExplanation(prescription._id, 'urdu')}
                                       className="w-full px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between"
                                     >
                                       <span>اردو میں وضاحت (Urdu)</span>
                                       <Languages className="w-4 h-4" />
                                     </button>
                                   </div>
                                 ) : (
                                   <div className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg p-4 relative">
                                     <div className="flex gap-1 mb-3 bg-white p-1 rounded-md border border-[#E9ECEF]">
                                       <button
                                         onClick={() => handleViewExplanation(prescription._id, 'english')}
                                         className={`flex-1 py-1 rounded text-xs font-semibold transition-colors ${explanationLanguage === 'english' ? 'bg-[#A23B72] text-white' : 'text-[#6C757D] hover:bg-gray-100'}`}
                                       >
                                         English
                                       </button>
                                       <button
                                          onClick={() => handleViewExplanation(prescription._id, 'urdu')}
                                          className={`flex-1 py-1 rounded text-xs font-semibold transition-colors ${explanationLanguage === 'urdu' ? 'bg-[#A23B72] text-white' : 'text-[#6C757D] hover:bg-gray-100'}`}
                                        >
                                          Urdu
                                        </button>
                                     </div>

                                     {isLoadingExplanation ? (
                                        <div className="flex justify-center py-6">
                                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#A23B72]/30 border-t-[#A23B72]"></div>
                                        </div>
                                      ) : explanationError ? (
                                        <p className="text-xs text-[#DC3545] text-center p-2">Failed to load explanation.</p>
                                      ) : explanationData?.data?.explanation && (
                                        <div className="text-sm text-[#495057] prose prose-sm max-w-none">
                                          <p className={`whitespace-pre-line leading-relaxed ${explanationLanguage === 'urdu' ? 'text-right font-[Noto Naskh Arabic]' : ''}`}>
                                            {explanationData.data.explanation}
                                          </p>
                                          {explanationData.data.note && (
                                            <p className="text-xs text-[#A0AEC0] italic mt-3 pt-3 border-t border-[#E9ECEF]">
                                              {explanationData.data.note}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                   </div>
                                 )}

                               </div>

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

