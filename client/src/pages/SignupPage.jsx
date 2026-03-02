import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSignupMutation } from '../services/authApi';
import { loginFailure } from '../store/slices/authSlice';
import { User, Mail, Lock, AlertCircle, Loader, UserCheck } from 'lucide-react';

const signupSchema = yup.object({
  firstName: yup.string().min(2, 'First name must be at least 2 characters').required('First name is required'),
  lastName: yup.string().min(2, 'Last name must be at least 2 characters').required('Last name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
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
      // Redirect to login page after successful signup
      navigate('/login', { state: { message: 'Account created successfully! Please sign in to continue.' } });
    } catch (error) {
      const errorMessage = error.data?.message || 'Signup failed. Please try again.';
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
              <UserCheck className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join MediCare</h1>
          <p className="text-gray-600 text-sm">Create your healthcare account in seconds</p>
        </div>

        {/* Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-200 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        {/* Signup Form Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-800 mb-2.5">
                  First Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    {...register('firstName')}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all focus:outline-none"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-800 mb-2.5">
                  Last Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    {...register('lastName')}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all focus:outline-none"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-800 mb-2.5">
                Account Type
              </label>
              <select
                id="role"
                {...register('role')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all focus:outline-none appearance-none cursor-pointer"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.role.message}</p>
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-500 font-medium">Already have an account?</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Sign In Link */}
        <Link
          to="/login"
          className="w-full py-3 px-4 border-2 border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-center hover:border-blue-300"
        >
          Sign In Instead
        </Link>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
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
