import { useGetPatientHistoryQuery } from "../../services/doctorApi";
import { User, FileText, Pill, Calendar } from 'lucide-react';
import { useState } from 'react';
import RiskFlags from './RiskFlags';

export default function PatientHistory({ patientId }) {
  const { data, isLoading, error } = useGetPatientHistoryQuery(patientId, {
    skip: !patientId,
  });

  if (!patientId) {
    return <p className="text-gray-500">Select a patient to view history</p>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <p className="text-red-600">Failed to load patient history</p>
      </div>
    );
  }

  const history = data?.data || {};

  return (
    <div className="space-y-6">
      {/* Patient Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <User className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {history.patient?.firstName} {history.patient?.lastName}
            </h3>
            <p className="text-sm text-gray-600">{history.patient?.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{history.appointments || 0}</p>
          <p className="text-xs text-gray-600 mt-1">Total Appointments</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{history.diagnoses?.length || 0}</p>
          <p className="text-xs text-gray-600 mt-1">Diagnoses</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{history.prescriptions?.length || 0}</p>
          <p className="text-xs text-gray-600 mt-1">Prescriptions</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {history.appointmentDetails?.length || 0}
          </p>
          <p className="text-xs text-gray-600 mt-1">Recent Visits</p>
        </div>
      </div>

      {/* Recent Diagnoses */}
      {history.diagnoses && history.diagnoses.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} /> Recent Diagnoses
          </h4>
          <div className="space-y-3">
            {history.diagnoses.slice(0, 5).map((diagnosis) => (
              <div key={diagnosis._id} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium text-gray-900">{diagnosis.condition}</p>
                <p className="text-sm text-gray-600">{diagnosis.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(diagnosis.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Prescriptions */}
      {history.prescriptions && history.prescriptions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Pill size={20} /> Recent Prescriptions
          </h4>
          <div className="space-y-3">
            {history.prescriptions.slice(0, 5).map((prescription) => (
              <div key={prescription._id} className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-medium text-gray-900">
                  {prescription.medications.map((m) => m.name).join(', ')}
                </p>
                <p className="text-sm text-gray-600">{prescription.instructions}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Status: <span className="font-semibold capitalize">{prescription.status}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Details */}
      {history.appointmentDetails && history.appointmentDetails.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} /> Recent Visits
          </h4>
          <div className="space-y-3">
            {history.appointmentDetails.map((apt) => (
              <div key={apt._id} className="border rounded-lg p-3">
                <p className="font-medium text-gray-900">{apt.title}</p>
                <p className="text-sm text-gray-600">{apt.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(apt.startTime).toLocaleDateString()} at{' '}
                  {new Date(apt.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Flags */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Analysis</h4>
        <RiskFlags patientId={patientId} />
      </div>
    </div>
  );
}
