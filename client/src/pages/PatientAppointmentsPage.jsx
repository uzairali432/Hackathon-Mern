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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
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
                My Appointments
              </h1>
              <p className="text-xs text-gray-500">View and manage your appointment history</p>
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
              <Calendar size={16} />
              Filter by status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium transition-all duration-200 hover:border-gray-400"
            >
              <option value="">All Appointments</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading appointments...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Failed to Load Appointments</h3>
                <p className="text-sm text-red-700">Please try again or contact support if the problem persists.</p>
              </div>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {!isLoading && !error && (
          <>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Calendar className="text-gray-400" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Appointments Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {statusFilter
                    ? `You don't have any ${statusFilter} appointments. Try selecting a different filter.`
                    : "You don't have any appointments yet. Schedule one with your doctor to get started."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment, index) => (
                  <div
                    key={appointment._id}
                    className="group bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <Calendar className="text-blue-600" size={24} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {appointment.title}
                              </h3>
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)} border`}>
                                {getStatusIcon(appointment.status)}
                                <span className="capitalize">{appointment.status.replace('-', ' ')}</span>
                              </div>
                            </div>
                            {appointment.description && (
                              <p className="text-gray-600 mb-4 leading-relaxed">{appointment.description}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                <Clock className="text-blue-600 flex-shrink-0" size={18} />
                                <div>
                                  <span className="text-xs text-gray-500 block">Date</span>
                                  <span className="text-sm font-medium text-gray-900">{formatDate(appointment.startTime)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                <Clock className="text-blue-600 flex-shrink-0" size={18} />
                                <div>
                                  <span className="text-xs text-gray-500 block">Time</span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                                  </span>
                                </div>
                              </div>
                              {appointment.doctorId && (
                                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                  <User className="text-blue-600 flex-shrink-0" size={18} />
                                  <div>
                                    <span className="text-xs text-gray-500 block">Doctor</span>
                                    <span className="text-sm font-medium text-gray-900">
                                      Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {appointment.type && (
                                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                  <FileText className="text-blue-600 flex-shrink-0" size={18} />
                                  <div>
                                    <span className="text-xs text-gray-500 block">Type</span>
                                    <span className="text-sm font-medium text-gray-900 capitalize">{appointment.type}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {appointment.notes && (
                              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                                <p className="text-sm text-gray-700">
                                  <span className="font-semibold text-gray-900">Notes:</span> {appointment.notes}
                                </p>
                              </div>
                            )}
                          </div>
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

