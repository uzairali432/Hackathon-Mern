import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLoginMutation } from '../services/authApi';
import { loginSuccess, loginFailure } from '../store/slices/authSlice';
import { Mail, Lock, AlertCircle, Loader, CheckCircle, Heart } from 'lucide-react';

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

      if (expectedRole && response.data?.user?.role !== expectedRole) {
        const msg = `This account is not a ${expectedRole}. Please sign in on the correct page.`;
        setServerError(msg);
        dispatch(loginFailure(msg));
        return;
      }

      dispatch(loginSuccess(response.data));

      const userRole = response.data?.user?.role;
      if (userRole === 'patient') {
        navigate('/patient-dashboard');
      } else if (userRole === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (userRole === 'receptionist') {
        navigate('/receptionist-dashboard');
      } else {
        navigate('/admin');
      }
    } catch (error) {
      const errorMessage = error.data?.message || 'Login failed. Please try again.';
      setServerError(errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Heart className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            MediCare Hub
          </h1>
          <p className="text-gray-600 text-sm">Professional Medical Management System</p>
          {expectedRole && (
            <p className="text-blue-600 font-medium mt-3 text-sm">Sign in as {expectedRole}</p>
          )}
        </div>

        {/* Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-200 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50/80 border border-green-200 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2.5">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="doctor@medicare.com"
                  {...register('email')}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all focus:outline-none"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2.5">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all focus:outline-none"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In Securely</span>
              )}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-500 font-medium">Don't have an account?</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Sign Up Link */}
        <Link
          to="/signup"
          className="w-full py-3 px-4 border-2 border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-center hover:border-blue-300"
        >
          Create New Account
        </Link>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
