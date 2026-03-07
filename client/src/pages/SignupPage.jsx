import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSignupMutation } from '../services/authApi';
import { loginFailure } from '../store/slices/authSlice';
import { User, Mail, Lock, AlertCircle, Loader, UserPlus, ShieldCheck, Stethoscope } from 'lucide-react';

const signupSchema = yup.object({
  firstName: yup.string().min(2, 'First name must be at least 2 characters').required('First name is required'),
  lastName: yup.string().min(2, 'Last name must be at least 2 characters').required('Last name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'), // Changed to 8 for security
  role: yup.string().oneOf(['admin', 'doctor', 'receptionist', 'patient', 'user'], 'Invalid role').required('Role is required'),
});

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { isLoading }] = useSignupMutation();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: { role: 'patient' },
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await signup(data).unwrap();
      navigate('/login', { state: { message: 'Registration successful. Please securely log in.' } });
    } catch (error) {
      const errorMessage = error.data?.message || 'Registration failed. Please check your network and try again.';
      setServerError(errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4 sm:px-6 lg:px-8 py-12 font-['Inter'] selection:bg-teal-100 selection:text-teal-900 relative">
      
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#E0F4F1] to-[#F8F9FA] blur-3xl opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-[#E8F4F8] to-[#F8F9FA] blur-3xl opacity-70 pointer-events-none"></div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-[#E9ECEF] relative overflow-hidden z-10 p-8 sm:p-12">
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2E86AB] to-[#00A896]"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-[#F8F9FA] rounded-2xl flex items-center justify-center shadow-sm border border-[#E9ECEF] relative group">
               <div className="absolute inset-0 bg-[#00A896]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <UserPlus className="w-8 h-8 text-[#00A896]" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-[#212529] tracking-tight mb-2">Patient Registration</h1>
          <p className="text-[#6C757D] font-medium text-sm">Create your secure MedConnect health account</p>
          <div className="flex items-center justify-center gap-2 mt-3">
             <ShieldCheck className="w-4 h-4 text-[#28A745]" />
             <span className="text-[10px] font-bold text-[#28A745] uppercase tracking-widest">Medical Grade Security</span>
          </div>
        </div>

        {/* Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-800">{serverError}</p>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
                Legal First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-[#A0AEC0]" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  {...register('firstName')}
                  className={`block w-full pl-11 pr-4 py-3 bg-[#F8F9FA] border ${errors.firstName ? 'border-[#DC3545] focus:ring-[#DC3545]/20 focus:border-[#DC3545]' : 'border-[#DEE2E6] focus:ring-[#00A896]/20 focus:border-[#00A896]'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-[#212529] transition-all`}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1.5 text-xs text-[#DC3545] font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
                Legal Last Name
              </label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-[#A0AEC0]" />
                 </div>
                 <input
                   id="lastName"
                   type="text"
                   placeholder="Last Name"
                   {...register('lastName')}
                   className={`block w-full pl-11 pr-4 py-3 bg-[#F8F9FA] border ${errors.lastName ? 'border-[#DC3545] focus:ring-[#DC3545]/20 focus:border-[#DC3545]' : 'border-[#DEE2E6] focus:ring-[#00A896]/20 focus:border-[#00A896]'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-[#212529] transition-all`}
                 />
              </div>
              {errors.lastName && (
                <p className="mt-1.5 text-xs text-[#DC3545] font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
              Primary Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Mail className="h-4 w-4 text-[#A0AEC0]" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className={`block w-full pl-11 pr-4 py-3 bg-[#F8F9FA] border ${errors.email ? 'border-[#DC3545] focus:ring-[#DC3545]/20 focus:border-[#DC3545]' : 'border-[#DEE2E6] focus:ring-[#00A896]/20 focus:border-[#00A896]'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-[#212529] transition-all`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-[#DC3545] font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label htmlFor="role" className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
              User Designation
            </label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Stethoscope className="h-4 w-4 text-[#A0AEC0]" />
               </div>
               <select
                 id="role"
                 {...register('role')}
                 className={`block w-full pl-11 pr-4 py-3 bg-[#F8F9FA] border ${errors.role ? 'border-[#DC3545] focus:ring-[#DC3545]/20 focus:border-[#DC3545]' : 'border-[#DEE2E6] focus:ring-[#00A896]/20 focus:border-[#00A896]'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-[#212529] transition-all appearance-none cursor-pointer`}
               >
                 <option value="patient">Patient Details</option>
                 <option value="doctor">Medical Provider (Doctor)</option>
                 <option value="receptionist">Clinical Staff (Receptionist)</option>
                 <option value="admin">System Administrator</option>
               </select>
            </div>
            {errors.role && (
              <p className="mt-1.5 text-xs text-[#DC3545] font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.role.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
              Secure Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Lock className="h-4 w-4 text-[#A0AEC0]" />
              </div>
              <input
                id="password"
                type="password"
                placeholder="Required Min. 8 characters"
                {...register('password')}
                className={`block w-full pl-11 pr-4 py-3 bg-[#F8F9FA] border ${errors.password ? 'border-[#DC3545] focus:ring-[#DC3545]/20 focus:border-[#DC3545]' : 'border-[#DEE2E6] focus:ring-[#00A896]/20 focus:border-[#00A896]'} rounded-xl focus:outline-none focus:ring-2 focus:bg-white text-[#212529] transition-all`}
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-[#DC3545] font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password.message}</p>
            )}
            <p className="mt-2 text-[10px] text-[#6C757D] font-medium">Use a strong, unique password for your medical records.</p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
             <button
               type="submit"
               disabled={isLoading}
               className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#00A896] to-[#02998A] text-white rounded-xl hover:from-[#028F7E] hover:to-[#028073] font-bold text-sm transition-all shadow-sm focus:ring-2 focus:ring-[#00A896]/50 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed group"
             >
               {isLoading ? (
                 <>
                   <Loader className="w-4 h-4 animate-spin" />
                   <span>Registering Record...</span>
                 </>
               ) : (
                 <>
                   <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                   <span>Complete Registration</span>
                 </>
               )}
             </button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#E9ECEF]"></div>
          <span className="text-[10px] font-bold text-[#6C757D] uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-[#E9ECEF]"></div>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
            <p className="text-sm font-medium text-[#495057] mb-3">Already have a patient portal account?</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-3 px-4 border-2 border-[#E9ECEF] text-[#495057] font-bold rounded-xl hover:bg-[#F8F9FA] hover:border-[#DEE2E6] transition-all text-sm"
            >
              Securely Sign In
            </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[10px] font-medium text-[#A0AEC0] leading-relaxed">
          By registering, you acknowledge that you have read and agree to the <br />
          <a href="#" className="text-[#00A896] hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[#00A896] hover:underline">HIPAA Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
