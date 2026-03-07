import { useGetPatientHistoryQuery } from "../../services/doctorApi";
import { User, FileText, Pill, Calendar, Activity, AlertCircle, RefreshCw, ClipboardType, Clock, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import RiskFlags from './RiskFlags';

export default function PatientHistory({ patientId }) {
  const { data, isLoading, error, refetch } = useGetPatientHistoryQuery(patientId, {
    skip: !patientId,
  });

  if (!patientId) {
    return (
      <div className="text-center py-12 px-4 bg-[#F8F9FA] rounded-2xl border border-dashed border-[#DEE2E6]">
        <ClipboardType className="w-12 h-12 text-[#A0AEC0] mx-auto mb-3 opacity-50" />
        <p className="text-[#6C757D] font-medium">Please enter a valid Patient ID or MRN to view their medical history.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-16 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#E9ECEF] border-t-[#2E86AB]"></div>
        <p className="text-[#6C757D] font-medium animate-pulse">Retrieving secure patient records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-red-800 font-bold mb-1">Record Retrieval Failed</h3>
        <p className="text-red-600 text-sm mb-4">There was a problem securely connecting to the server or the Patient ID is incorrect.</p>
        <button 
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-lg text-red-700 text-sm font-semibold hover:bg-red-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const history = data?.data || {};

  return (
    <div className="space-y-6">
      {/* Patient Info Card */}
      <div className="bg-white rounded-2xl border border-[#E9ECEF] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-[#2E86AB]/5 to-transparent rounded-bl-full pointer-events-none"></div>
        
        <div className="w-16 h-16 bg-[#F8F9FA] border border-[#DEE2E6] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm z-10">
          <User className="text-[#2E86AB] w-8 h-8" />
        </div>
        
        <div className="flex-1 z-10">
           <div className="flex flex-wrap items-center gap-2 mb-1">
             <h3 className="text-xl font-bold text-[#212529]">
               {history.patient?.firstName} {history.patient?.lastName}
             </h3>
             <span className="px-2 py-0.5 bg-[#E8F4F8] text-[#2E86AB] text-[10px] font-bold uppercase tracking-wider rounded border border-[#2E86AB]/20">Verified Patient</span>
           </div>
          <p className="text-sm font-medium text-[#6C757D] flex items-center gap-1.5 mb-2"><ClipboardType className="w-3.5 h-3.5"/> MRN: {patientId}</p>
          <p className="text-sm text-[#495057]">{history.patient?.email}</p>
        </div>
      </div>

      {/* Quick Clinical Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Visits', value: history.appointments || 0, color: 'text-[#2E86AB]', bg: 'bg-[#E8F4F8]', border: 'border-[#2E86AB]/20' },
          { label: 'Diagnoses', value: history.diagnoses?.length || 0, color: 'text-[#A23B72]', bg: 'bg-[#F2E5EC]', border: 'border-[#A23B72]/20' },
          { label: 'Prescriptions', value: history.prescriptions?.length || 0, color: 'text-[#00A896]', bg: 'bg-[#E0F4F1]', border: 'border-[#00A896]/20' },
          { label: 'Recent Visits', value: history.appointmentDetails?.length || 0, color: 'text-[#F59E0B]', bg: 'bg-[#FEF3C7]', border: 'border-[#F59E0B]/20' },
        ].map((stat, idx) => (
          <div key={idx} className={`rounded-2xl border p-5 flex flex-col items-center justify-center text-center ${stat.bg} ${stat.border}`}>
            <p className={`text-3xl font-bold tracking-tight mb-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-bold text-[#495057] uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Recent Diagnoses */}
          {history.diagnoses && history.diagnoses.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E9ECEF] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E9ECEF] bg-[#F8F9FA]">
                <h4 className="font-bold text-[#212529] flex items-center gap-2">
                  <div className="p-1.5 bg-[#E8F4F8] rounded-md text-[#2E86AB]">
                    <Activity size={16} />
                  </div>
                  Clinical Diagnoses
                </h4>
              </div>
              <div className="p-5 space-y-4">
                {history.diagnoses.slice(0, 5).map((diagnosis) => (
                  <div key={diagnosis._id} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-[#2E86AB] before:rounded-full">
                    <p className="font-bold text-[#212529] text-base leading-tight mb-1">{diagnosis.condition}</p>
                    <p className="text-sm text-[#495057] mb-2">{diagnosis.description}</p>
                    <p className="text-xs font-semibold text-[#6C757D] flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Recorded: {new Date(diagnosis.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Prescriptions */}
          {history.prescriptions && history.prescriptions.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E9ECEF] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E9ECEF] bg-[#F8F9FA]">
                <h4 className="font-bold text-[#212529] flex items-center gap-2">
                  <div className="p-1.5 bg-[#E0F4F1] rounded-md text-[#00A896]">
                    <Pill size={16} />
                  </div>
                  Medication History
                </h4>
              </div>
              <div className="p-5 space-y-4">
                {history.prescriptions.slice(0, 5).map((prescription) => (
                  <div key={prescription._id} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-[#00A896] before:rounded-full">
                    <p className="font-bold text-[#212529] text-base leading-tight mb-1">
                      {prescription.medications.map((m) => m.name).join(', ')}
                    </p>
                    <p className="text-sm text-[#495057] mb-2">{prescription.instructions}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                        prescription.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Risk Flags */}
          <div className="bg-white rounded-2xl border border-[#E9ECEF] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E9ECEF] bg-[#F8F9FA]">
              <h4 className="font-bold text-[#212529] flex items-center gap-2">
                <div className="p-1.5 bg-red-50 rounded-md text-red-600">
                  <AlertCircle size={16} />
                </div>
                Clinical Risk Analysis
              </h4>
            </div>
            <div className="p-5">
              <RiskFlags patientId={patientId} />
            </div>
          </div>

          {/* Appointment Details */}
          {history.appointmentDetails && history.appointmentDetails.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E9ECEF] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E9ECEF] bg-[#F8F9FA]">
                <h4 className="font-bold text-[#212529] flex items-center gap-2">
                  <div className="p-1.5 bg-[#F8F9FA] rounded-md text-[#6C757D] border border-[#DEE2E6]">
                    <Clock size={16} />
                  </div>
                  Encounter History
                </h4>
              </div>
              <div className="p-5 space-y-3">
                {history.appointmentDetails.map((apt) => (
                  <div key={apt._id} className="p-4 rounded-xl border border-[#E9ECEF] bg-[#F8F9FA] hover:bg-white hover:border-[#CED4DA] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-[#212529]">{apt.title}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A23B72] bg-[#F2E5EC] px-2 py-1 rounded">Past Visit</span>
                    </div>
                    <p className="text-sm text-[#495057] mb-3 line-clamp-2">{apt.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#6C757D]">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {new Date(apt.startTime).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
