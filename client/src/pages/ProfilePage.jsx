import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUpdateProfileMutation } from '../services/userApi';
import { ArrowLeft, Save, ShieldCheck, Camera, User, Mail, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const profileSchema = yup.object({
  firstName: yup.string().min(2).required('First name is required'),
  lastName: yup.string().min(2).required('Last name is required'),
  bio: yup.string().max(500),
});

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Get dashboard URL based on role
  const getDashboardUrl = () => {
    switch (user?.role) {
      case 'patient':
        return '/patient-dashboard';
      case 'doctor':
        return '/doctor-dashboard';
      case 'receptionist':
        return '/receptionist-dashboard';
      default:
        return '/admin';
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await updateProfile(data).unwrap();
      setSuccessMessage('Clinical profile details updated successfully.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      setErrorMessage(error.data?.message || 'Failed to securely update profile.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] font-['Inter'] pb-12">
      
      {/* Header */}
      <nav className="bg-white border-b border-[#E9ECEF] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(getDashboardUrl())}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2E86AB] transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-[#212529] tracking-tight">Clinical Profile</h1>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E8F4F8] rounded-full border border-[#2E86AB]/20">
              <ShieldCheck className="w-4 h-4 text-[#2E86AB]" />
              <span className="text-[10px] font-bold text-[#2E86AB] tracking-widest uppercase">Verified</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        
        {successMessage && (
          <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-800 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] relative overflow-hidden">
          
          {/* Header Banner */}
          <div className="relative h-32 bg-gradient-to-r from-[#212529] to-[#343A40] overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          </div>
          
          {/* Profile Picture & Info */}
          <div className="px-6 sm:px-10 pb-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 mb-8 group relative inline-block w-fit">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl border-4 border-white bg-white overflow-hidden shadow-sm relative z-10 transform transition-transform group-hover:scale-[1.02]">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user?.firstName || 'J'}+${user?.lastName || 'D'}&background=E8F4F8&color=2E86AB&size=256`} 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-[#212529]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                     <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="pb-2">
                <h2 className="text-2xl font-black text-[#212529] tracking-tight">{user?.firstName || 'John'} {user?.lastName || 'Doe'}</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-[#00A896]"></div>
                   <p className="text-[#6C757D] font-bold text-xs uppercase tracking-widest">
                     {user?.role || 'Patient'} Account
                   </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="space-y-6">
                <h3 className="text-sm font-black text-[#495057] uppercase tracking-wider border-b border-[#E9ECEF] pb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2E86AB]" /> Primary Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
                      Legal First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      {...register('firstName')}
                      className={`block w-full px-4 py-3 bg-[#F8F9FA] border ${errors.firstName ? 'border-[#DC3545] focus:ring-[#DC3545]/20 focus:border-[#DC3545]' : 'border-[#DEE2E6] focus:ring-[#2E86AB]/20 focus:border-[#2E86AB]'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-[#212529] sm:text-sm transition-all duration-200`}
                    />
                    {errors.firstName && <p className="mt-2 text-xs text-[#DC3545] font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.firstName.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
                      Legal Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName')}
                      className={`block w-full px-4 py-3 bg-[#F8F9FA] border ${errors.lastName ? 'border-[#DC3545] focus:ring-[#DC3545]/20 focus:border-[#DC3545]' : 'border-[#DEE2E6] focus:ring-[#2E86AB]/20 focus:border-[#2E86AB]'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-[#212529] sm:text-sm transition-all duration-200`}
                    />
                    {errors.lastName && <p className="mt-2 text-xs text-[#DC3545] font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
                    Primary Email
                  </label>
                  <div className="relative relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                       <Mail className="w-4 h-4 text-[#A0AEC0]" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="block w-full pl-11 pr-4 py-3 bg-[#E9ECEF] border border-[#DEE2E6] rounded-xl text-[#6C757D] sm:text-sm cursor-not-allowed opacity-80"
                    />
                  </div>
                  <p className="mt-2 text-[10px] font-bold text-[#6C757D] tracking-wide uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00A896]" /> Email identifier is securely immutably bound to this record.
                  </p>
                </div>
              </div>

              <div className="space-y-6 pt-2">
                <h3 className="text-sm font-black text-[#495057] uppercase tracking-wider border-b border-[#E9ECEF] pb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#00A896]" /> Clinical Context Profile
                </h3>
                
                <div>
                  <label htmlFor="bio" className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
                    Medical Background Summary <span className="text-[#A0AEC0] font-normal lowercase tracking-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="bio"
                    {...register('bio')}
                    rows="5"
                    className={`block w-full px-4 py-3 bg-[#F8F9FA] border ${errors.bio ? 'border-[#DC3545] focus:ring-[#DC3545]/20 focus:border-[#DC3545]' : 'border-[#DEE2E6] focus:ring-[#00A896]/20 focus:border-[#00A896]'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-[#212529] sm:text-sm transition-all duration-200 resize-y`}
                    placeholder="Briefly summarize chronic conditions, known allergies, prior major procedures, or ongoing treatments..."
                  />
                  {errors.bio && <p className="mt-2 text-xs text-[#DC3545] font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.bio.message}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-[#E9ECEF] flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                     reset();
                     navigate(getDashboardUrl());
                  }}
                  className="px-6 py-3 border border-[#DEE2E6] text-[#495057] bg-white rounded-xl hover:bg-[#F8F9FA] font-bold transition-colors focus:ring-2 focus:ring-[#E9ECEF] focus:outline-none sm:order-1 order-2 text-sm"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !isDirty}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-[#2E86AB] text-white rounded-xl hover:bg-[#1A5F7A] disabled:bg-[#DEE2E6] disabled:text-[#ADB5BD] disabled:cursor-not-allowed font-bold transition-all shadow-sm focus:ring-2 focus:ring-[#2E86AB]/50 focus:outline-none sm:order-2 order-1 text-sm group"
                >
                  {isLoading ? (
                     <>
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       <span>Saving Data...</span>
                     </>
                  ) : (
                     <>
                        <Save className="w-4 h-4" />
                        <span>Save Clinical Profile</span>
                     </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
