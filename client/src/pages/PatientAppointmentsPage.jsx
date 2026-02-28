import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetPatientAppointmentsQuery } from '../services/patientApi';
import { ArrowLeft, Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function PatientAppointmentsPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data, isLoading, error } = useGetPatientAppointmentsQuery({ status: statusFilter || undefined });

  const appointments = data?.data || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />;
      case 'in-progress':
        return <AlertCircle className="text-blue-600" size={20} />;
      default:
        return <Clock className="text-yellow-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
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
            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
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
            <option value="">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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
            <p className="text-red-800">Failed to load appointments. Please try again.</p>
          </div>
        )}

        {/* Appointments List */}
        {!isLoading && !error && (
          <>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
                <p className="text-gray-600">
                  {statusFilter
                    ? `You don't have any ${statusFilter} appointments.`
                    : "You don't have any appointments yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 bg-blue-100 rounded-full">
                            <Calendar className="text-blue-600" size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {appointment.title}
                            </h3>
                            {appointment.description && (
                              <p className="text-gray-600 mb-4">{appointment.description}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock size={18} />
                                <span className="font-medium">Date:</span>
                                <span>{formatDate(appointment.startTime)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock size={18} />
                                <span className="font-medium">Time:</span>
                                <span>
                                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                                </span>
                              </div>
                              {appointment.doctorId && (
                                <div className="flex items-center gap-2 text-gray-700">
                                  <User size={18} />
                                  <span className="font-medium">Doctor:</span>
                                  <span>
                                    Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}
                                  </span>
                                </div>
                              )}
                              {appointment.type && (
                                <div className="flex items-center gap-2 text-gray-700">
                                  <FileText size={18} />
                                  <span className="font-medium">Type:</span>
                                  <span className="capitalize">{appointment.type}</span>
                                </div>
                              )}
                            </div>

                            {appointment.notes && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Notes:</span> {appointment.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">{appointment.status.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

