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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-medscape-light">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-medscape-navy rounded-md flex items-center justify-center shadow-clinical">
              <Heart className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-medscape-navy mb-2">
            MediCare Hub
          </h1>
          <p className="text-medscape-gray text-sm">Clinical Medical Management System</p>
          {expectedRole && (
            <p className="text-medscape-blue font-medium mt-3 text-sm">Sign in as {expectedRole}</p>
          )}
        </div>

        {/* Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-sm text-success">{successMessage}</p>
          </div>
        )}

        {/* Login Form Card */}
        <div className="bg-white shadow-soft p-8 border border-medscape-border rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-medscape-text mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-medscape-gray group-focus-within:text-medscape-blue transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="doctor@clinic.com"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-2.5 border border-medscape-border rounded-md text-medscape-text placeholder-medscape-gray focus:border-medscape-blue focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-error font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-medscape-text mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-medscape-gray group-focus-within:text-medscape-blue transition-colors" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full pl-10 pr-4 py-2.5 border border-medscape-border rounded-md text-medscape-text placeholder-medscape-gray focus:border-medscape-blue focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-error font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-medscape-navy text-white font-semibold rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-medscape-blue focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 shadow-soft hover:shadow-clinical"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-medscape-border"></div>
          <span className="text-sm text-medscape-gray font-medium">New to system?</span>
          <div className="flex-1 h-px bg-medscape-border"></div>
        </div>

        {/* Sign Up Link */}
        <Link
          to="/signup"
          className="w-full py-2.5 px-4 border border-medscape-border text-medscape-navy font-semibold rounded-md hover:bg-medscape-light focus:outline-none focus:ring-2 focus:ring-medscape-blue focus:ring-offset-2 transition-all text-center"
        >
          Create Account
        </Link>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-medscape-gray">
          By signing in, you agree to our{' '}
          <a href="#" className="text-medscape-blue hover:text-primary font-semibold">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" className="text-medscape-blue hover:text-primary font-semibold">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
