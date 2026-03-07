import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useChangePasswordMutation } from '../services/userApi';
import { ArrowLeft, Lock, ShieldCheck, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
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
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await changePassword(data).unwrap();
      setSuccessMessage('Security credentials updated successfully.');
      reset();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      setErrorMessage(error.data?.message || 'Failed to update security credentials.');
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
                aria-label="Go back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-[#212529] tracking-tight">Security Settings</h1>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E0F4F1] rounded-full border border-[#00A896]/20">
              <ShieldCheck className="w-4 h-4 text-[#00A896]" />
              <span className="text-[10px] font-bold text-[#00A896] tracking-widest uppercase">Encrypted</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
        
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
           {/* Decorative Top Accent */}
           <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#212529] to-[#495057]"></div>

           <div className="p-6 sm:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] border border-[#DEE2E6] flex items-center justify-center shadow-sm">
                   <KeyRound className="text-[#495057] w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-[#212529] tracking-tight mb-1">Update Password</h2>
                   <p className="text-sm text-[#6C757D] font-medium">Manage your account authentication credentials</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                       <Lock className="w-4 h-4 text-[#A0AEC0]" />
                    </div>
                    <input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter your current password"
                      {...register('currentPassword')}
                      className={`block w-full pl-11 pr-4 py-3 bg-[#F8F9FA] border ${errors.currentPassword ? 'border-[#DC3545] focus:ring-[#DC3545]/20 focus:border-[#DC3545]' : 'border-[#DEE2E6] focus:ring-[#212529]/20 focus:border-[#212529]'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-[#212529] sm:text-sm transition-all duration-200`}
                    />
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-2 text-xs text-[#DC3545] font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <hr className="border-[#E9ECEF] my-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {/* New Password */}
                   <div>
                     <label htmlFor="newPassword" className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
                       New Password
                     </label>
                     <input
                       id="newPassword"
                       type="password"
                       placeholder="Min. 8 characters"
                       {...register('newPassword')}
                       className={`block w-full px-4 py-3 bg-[#F8F9FA] border ${errors.newPassword ? 'border-[#DC3545] focus:ring-[#DC3545]/20 focus:border-[#DC3545]' : 'border-[#DEE2E6] focus:ring-[#2E86AB]/20 focus:border-[#2E86AB]'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-[#212529] sm:text-sm transition-all duration-200`}
                     />
                     {errors.newPassword && (
                        <p className="mt-2 text-xs text-[#DC3545] font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.newPassword.message}
                        </p>
                     )}
                   </div>

                   {/* Confirm New Password */}
                   <div>
                     <label htmlFor="confirmPassword" className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
                       Confirm Password
                     </label>
                     <input
                       id="confirmPassword"
                       type="password"
                       placeholder="Verify new password"
                       {...register('confirmPassword')}
                       className={`block w-full px-4 py-3 bg-[#F8F9FA] border ${errors.confirmPassword ? 'border-[#DC3545] focus:ring-[#DC3545]/20 focus:border-[#DC3545]' : 'border-[#DEE2E6] focus:ring-[#2E86AB]/20 focus:border-[#2E86AB]'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-[#212529] sm:text-sm transition-all duration-200`}
                     />
                     {errors.confirmPassword && (
                        <p className="mt-2 text-xs text-[#DC3545] font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
                        </p>
                     )}
                   </div>
                </div>

                {/* Actions */}
                <div className="pt-8 mt-2 flex flex-col sm:flex-row gap-4 justify-end border-t border-[#E9ECEF]">
                  <button
                    type="button"
                    onClick={() => {
                        reset();
                        navigate(getDashboardUrl());
                    }}
                    className="px-6 py-3 border border-[#DEE2E6] text-[#495057] bg-white rounded-xl hover:bg-[#F8F9FA] font-bold transition-all focus:ring-2 focus:ring-[#E9ECEF] focus:outline-none sm:order-1 order-2 text-sm"
                  >
                    Cancel Edit
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-[#212529] text-white rounded-xl hover:bg-[#343A40] disabled:bg-[#DEE2E6] disabled:text-[#ADB5BD] disabled:cursor-not-allowed font-bold transition-all shadow-sm focus:ring-2 focus:ring-[#212529]/50 focus:outline-none sm:order-2 order-1 text-sm"
                  >
                    {isLoading ? (
                       <>
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         <span>Updating...</span>
                       </>
                    ) : (
                       <span>Update Credentials</span>
                    )}
                  </button>
                </div>
              </form>
           </div>
        </div>

        {/* Security Guidelines */}
        <div className="mt-6 bg-[#E8F4F8] border border-[#2E86AB]/20 rounded-2xl p-6 relative overflow-hidden">
          <ShieldCheck className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-[#2E86AB]/5 pointer-events-none" />
          <h3 className="text-[#2E86AB] font-bold text-sm uppercase tracking-wider flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4" /> Password Guidelines
          </h3>
          <ul className="text-sm text-[#495057] font-medium space-y-2 relative z-10">
            <li className="flex items-start gap-2">
               <span className="text-[#2E86AB] font-black">•</span> Use a complex passphrase of at least 8 characters.
            </li>
            <li className="flex items-start gap-2">
               <span className="text-[#2E86AB] font-black">•</span> Mix uppercase and lowercase letters, numbers, and symbols.
            </li>
            <li className="flex items-start gap-2">
               <span className="text-[#2E86AB] font-black">•</span> Do not share your password across multiple clinical platforms.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
