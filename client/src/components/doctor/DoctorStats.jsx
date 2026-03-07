import { useGetDoctorStatsQuery } from "../../services/doctorApi";
import { BarChart3, Users, Calendar, FileText, Pill, TrendingUp, Activity, CheckCircle2, ChevronRight, PieChart } from 'lucide-react';

export default function DoctorStats() {
  const { data, isLoading, error } = useGetDoctorStatsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-16 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#E9ECEF] border-t-[#2E86AB]"></div>
        <p className="text-[#6C757D] font-medium animate-pulse">Compiling practice analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
        <Activity className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-red-800 font-bold mb-1">Analytics Unavailable</h3>
        <p className="text-red-600 text-sm">There was a problem securely retrieving your practice statistics.</p>
      </div>
    );
  }

  const stats = data?.data || {};

  const statCards = [
    {
      label: 'Total Encounters',
      value: stats.totalAppointments || 0,
      icon: Calendar,
      color: 'blue',
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Completed Sessions',
      value: stats.completedAppointments || 0,
      icon: CheckCircle2,
      color: 'emerald',
      trend: '+5%',
      trendUp: true
    },
    {
      label: 'Scheduled Visits',
      value: stats.scheduledAppointments || 0,
      icon: Calendar,
      color: 'amber',
      trend: 'Current',
      trendUp: true
    },
    {
      label: 'Unique Patients',
      value: stats.totalPatients || 0,
      icon: Users,
      color: 'purple',
      trend: '+8%',
      trendUp: true
    },
    {
      label: 'Clinical Diagnoses',
      value: stats.totalDiagnoses || 0,
      icon: FileText,
      color: 'rose',
      trend: '+15%',
      trendUp: true
    },
    {
      label: 'e-Prescriptions',
      value: stats.totalPrescriptions || 0,
      icon: Pill,
      color: 'teal',
      trend: '+22%',
      trendUp: true
    },
  ];

  const colorVariants = {
    blue: 'bg-[#E8F4F8] text-[#2E86AB] border-[#2E86AB]/20',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber: 'bg-[#FEF3C7] text-[#F59E0B] border-[#F59E0B]/20',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    rose: 'bg-[#F2E5EC] text-[#A23B72] border-[#A23B72]/20',
    teal: 'bg-[#E0F4F1] text-[#00A896] border-[#00A896]/20',
  };

  const iconVariants = {
    blue: 'bg-[#2E86AB]',
    emerald: 'bg-emerald-500',
    amber: 'bg-[#F59E0B]',
    purple: 'bg-purple-500',
    rose: 'bg-[#A23B72]',
    teal: 'bg-[#00A896]',
  };

  return (
    <div className="space-y-8 pb-8">
      
      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-[#E9ECEF] hover:border-[#CED4DA] p-6 transition-all shadow-sm hover:shadow-md group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${iconVariants[stat.color]}`}>
                  <Icon size={24} />
                </div>
                <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border ${colorVariants[stat.color]} `}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-3xl font-black text-[#212529] mb-1 tracking-tight">{stat.value.toLocaleString()}</p>
                <p className="text-sm font-bold text-[#6C757D] uppercase tracking-wide">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E9ECEF] p-6 sm:p-8 shadow-sm relative overflow-hidden">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#2E86AB]/5 to-transparent rounded-bl-full pointer-events-none"></div>
             
             <h4 className="text-lg font-bold text-[#212529] mb-6 flex items-center gap-2">
               <PieChart className="w-5 h-5 text-[#2E86AB]" /> Practice Performance
             </h4>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Completion Rate */}
                <div>
                  <div className="flex items-end justify-between mb-2">
                     <p className="text-sm font-bold text-[#495057] uppercase tracking-wide">Encounter Completion</p>
                     <span className="text-2xl font-black text-[#00A896] leading-none">{stats.completionRate || 0}%</span>
                  </div>
                  <div className="w-full bg-[#E9ECEF] rounded-full h-3 mb-2 overflow-hidden border border-[#DEE2E6]">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        stats.completionRate >= 80 ? 'bg-[#00A896]' : stats.completionRate >= 60 ? 'bg-[#F59E0B]' : 'bg-[#DC3545]'
                      }`}
                      style={{ width: `${stats.completionRate || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs font-semibold text-[#6C757D]">Target: &gt;85% completion rate</p>
                </div>

                {/* Average Diagnoses */}
                <div>
                  <div className="flex items-end justify-between mb-2">
                     <p className="text-sm font-bold text-[#495057] uppercase tracking-wide">Diagnoses / Encounter</p>
                     <span className="text-2xl font-black text-[#A23B72] leading-none">{stats.averageDiagnosesPerAppointment || 0}</span>
                  </div>
                  <div className="w-full bg-[#E9ECEF] rounded-full h-3 mb-2 overflow-hidden border border-[#DEE2E6]">
                    <div
                      className="h-full rounded-full bg-[#A23B72] transition-all duration-1000"
                      style={{ width: `${Math.min(((stats.averageDiagnosesPerAppointment || 0) / 3) * 100, 100)}%` }} // Arbitrary max of 3 for filling bar
                    ></div>
                  </div>
                  <p className="text-xs font-semibold text-[#6C757D]">Based on {stats.totalDiagnoses || 0} total diagnoses</p>
                </div>
             </div>
          </div>
        </div>

        {/* AI Clinical Insights */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#E8F4F8] to-[#E0F4F1] rounded-2xl border border-[#2E86AB]/20 p-6 sm:p-8 shadow-sm h-full">
            <h4 className="text-lg font-bold text-[#212529] mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2E86AB]" /> Practice Insights
            </h4>
            
            <ul className="space-y-5 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2E86AB]/20">
              <li className="relative pl-8">
                <div className="absolute left-[-1px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#2E86AB] flex items-center justify-center z-10">
                  <span className="text-[#2E86AB] font-bold text-xs">1</span>
                </div>
                <p className="text-sm text-[#495057] leading-relaxed">
                  You have actively managed care for <strong className="text-[#2E86AB]">{stats.totalPatients || 0}</strong> unique patients this period.
                </p>
              </li>
              <li className="relative pl-8">
                <div className="absolute left-[-1px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#00A896] flex items-center justify-center z-10">
                  <span className="text-[#00A896] font-bold text-xs">2</span>
                </div>
                <p className="text-sm text-[#495057] leading-relaxed">
                  Your appointment completion rate of <strong className="text-[#00A896]">{stats.completionRate || 0}%</strong> indicates excellent patient follow-through and schedule adherence.
                </p>
              </li>
              <li className="relative pl-8">
                <div className="absolute left-[-1px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#A23B72] flex items-center justify-center z-10">
                  <span className="text-[#A23B72] font-bold text-xs">3</span>
                </div>
                <p className="text-sm text-[#495057] leading-relaxed">
                  You are averaging <strong className="text-[#A23B72]">{stats.averageDiagnosesPerAppointment || 0}</strong> clinical assessments per patient encounter.
                </p>
              </li>
            </ul>

            <button className="mt-8 w-full py-2.5 bg-white border border-[#2E86AB]/30 rounded-xl text-sm font-bold text-[#2E86AB] hover:bg-[#2E86AB] hover:text-white transition-colors flex items-center justify-center gap-2 group shadow-sm">
              Generate Detailed Report <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
