import { useGetDoctorStatsQuery } from "../../services/doctorApi";
import { BarChart3, Users, Calendar, FileText, Pill, TrendingUp } from 'lucide-react';

export default function DoctorStats() {
  const { data, isLoading, error } = useGetDoctorStatsQuery();

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
        <p className="text-red-600">Failed to load statistics</p>
      </div>
    );
  }

  const stats = data?.data || {};

  const statCards = [
    {
      label: 'Total Appointments',
      value: stats.totalAppointments || 0,
      icon: Calendar,
      color: 'blue',
    },
    {
      label: 'Completed',
      value: stats.completedAppointments || 0,
      icon: TrendingUp,
      color: 'green',
    },
    {
      label: 'Scheduled',
      value: stats.scheduledAppointments || 0,
      icon: Calendar,
      color: 'yellow',
    },
    {
      label: 'Total Patients',
      value: stats.totalPatients || 0,
      icon: Users,
      color: 'purple',
    },
    {
      label: 'Diagnoses',
      value: stats.totalDiagnoses || 0,
      icon: FileText,
      color: 'red',
    },
    {
      label: 'Prescriptions',
      value: stats.totalPrescriptions || 0,
      icon: Pill,
      color: 'green',
    },
  ];

  const colorVariants = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    purple: 'bg-purple-100 text-purple-700',
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  const iconColorVariants = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={24} className="text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">Your Statistics</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 space-y-3 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <div className={`p-2 rounded-lg ${colorVariants[stat.color]}`}>
                  <Icon size={20} className={iconColorVariants[stat.color]} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Completion Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600 mb-3">Completion Rate</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">{stats.completionRate || 0}%</span>
              <span className="text-xs text-gray-500">of all appointments</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  stats.completionRate >= 80
                    ? 'bg-green-600'
                    : stats.completionRate >= 60
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
                style={{ width: `${stats.completionRate || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Average Diagnoses */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600 mb-3">Avg. Diagnoses per Appointment</p>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-purple-600">
              {stats.averageDiagnosesPerAppointment || 0}
            </div>
            <p className="text-xs text-gray-500">
              {stats.totalDiagnoses || 0} diagnoses made
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-3">Quick Insights</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>
              You've provided healthcare to <strong>{stats.totalPatients}</strong> unique patients
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>
              Completion rate of <strong>{stats.completionRate || 0}%</strong> shows strong follow-up
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>
              Average of <strong>{stats.averageDiagnosesPerAppointment}</strong> diagnoses per
              appointment
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
