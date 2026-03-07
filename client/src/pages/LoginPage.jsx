import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLoginMutation } from '../services/authApi';
import { loginSuccess, loginFailure } from '../store/slices/authSlice';
import { Mail, Lock, AlertCircle, Loader, CheckCircle, ShieldCheck, Stethoscope } from 'lucide-react';

const loginSchema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage({ expectedRole = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState('');
  const successMessage = location.state?.message;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const response = await login(data).unwrap();

      // If this LoginPage expects a specific role, enforce it
      if (expectedRole && response.data?.user?.role !== expectedRole) {
        const msg = `This account is not a ${expectedRole}. Please sign in on the correct page.`;
        setServerError(msg);
        dispatch(loginFailure(msg));
        return;
      }

      dispatch(loginSuccess(response.data));

      // Redirect to role-specific dashboard
      const userRole = response.data?.user?.role;
      if (userRole === 'patient') {
        navigate('/patient-dashboard');
      } else if (userRole === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (userRole === 'receptionist') {
        navigate('/receptionist-dashboard');
      } else {
        navigate('/admin'); // Default to admin for admin role
      }
    } catch (error) {
      const errorMessage = error.data?.message || 'Login failed. Please verify your credentials.';
      setServerError(errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-['Inter'] selection:bg-teal-100 selection:text-teal-900">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-[#E9ECEF] py-4 px-6 sm:px-10 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A896] to-[#028F7E] flex items-center justify-center shadow-sm">
            <Stethoscope className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-[#2E86AB]">
            Med<span className="text-[#00A896]">Connect</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-[#6C757D]">
          <ShieldCheck className="w-4 h-4 text-[#28A745]" />
          <span className="hidden sm:inline">Secure & HIPAA Compliant</span>
          <span className="sm:hidden">Secure</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        {/* Abstract Background Element */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00A896]/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#2E86AB]/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E9ECEF] p-8 sm:p-10 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#212529] mb-3">
              {expectedRole ? `${expectedRole.charAt(0).toUpperCase() + expectedRole.slice(1)} Portal` : 'Welcome to MedConnect'}
            </h1>
            <p className="text-[#6C757D] text-sm sm:text-base">
              {expectedRole 
                ? `Please sign in securely to access your ${expectedRole} account.` 
                : 'Sign in to access your secure health information.'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#DC3545] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#DC3545] font-medium">{serverError}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#28A745] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#28A745] font-medium">{successMessage}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#495057] mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[#A0AEC0] group-focus-within:text-[#00A896] transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className="block w-full pl-10 pr-4 py-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl text-[#212529] placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] focus:bg-white transition-all sm:text-sm outline-none"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-[#DC3545] font-medium flex items-center gap-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-[#495057]">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-[#00A896] hover:text-[#028F7E] transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#A0AEC0] group-focus-within:text-[#00A896] transition-colors" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  {...register('password')}
                  className="block w-full pl-10 pr-4 py-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl text-[#212529] placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] focus:bg-white transition-all sm:text-sm outline-none"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-[#DC3545] font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#00A896] text-white font-semibold rounded-xl hover:bg-[#028F7E] focus:outline-none focus:ring-4 focus:ring-[#00A896]/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In Securely'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E9ECEF]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-[#A0AEC0] font-medium">New patient?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to="/signup"
            className="block w-full py-3 px-4 border border-[#DEE2E6] text-[#495057] font-semibold rounded-xl hover:bg-[#F8F9FA] focus:outline-none focus:ring-4 focus:ring-[#E9ECEF] transition-all text-center"
          >
            Create an Account
          </Link>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#6C757D]">
             <Lock className="w-3 h-3" />
             <p>End-to-end encrypted connection</p>
          </div>
        </div>
      </div>
    </div>
  );
}
