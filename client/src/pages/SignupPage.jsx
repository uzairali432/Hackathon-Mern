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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-medscape-light">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-medscape-navy rounded-md flex items-center justify-center shadow-clinical">
              <UserCheck className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-medscape-navy mb-2">Create Account</h1>
          <p className="text-medscape-gray text-sm">Register for clinical platform access</p>
        </div>

        {/* Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{serverError}</p>
          </div>
        )}

        {/* Signup Form Card */}
        <div className="bg-white shadow-soft p-8 border border-medscape-border rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-medscape-text mb-2">
                  First Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 w-5 h-5 text-medscape-gray group-focus-within:text-medscape-blue transition-colors" />
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    {...register('firstName')}
                    className="w-full pl-10 pr-4 py-2.5 border border-medscape-border rounded-md text-medscape-text placeholder-medscape-gray focus:border-medscape-blue focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1.5 text-sm text-error font-medium">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-medscape-text mb-2">
                  Last Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 w-5 h-5 text-medscape-gray group-focus-within:text-medscape-blue transition-colors" />
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    {...register('lastName')}
                    className="w-full pl-10 pr-4 py-2.5 border border-medscape-border rounded-md text-medscape-text placeholder-medscape-gray focus:border-medscape-blue focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1.5 text-sm text-error font-medium">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-medscape-text mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-medscape-gray group-focus-within:text-medscape-blue transition-colors" />
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

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-medscape-text mb-2">
                Role
              </label>
              <select
                id="role"
                {...register('role')}
                className="w-full px-4 py-2.5 border border-medscape-border rounded-md text-medscape-text bg-white focus:border-medscape-blue focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none appearance-none cursor-pointer"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1.5 text-sm text-error font-medium">{errors.role.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-medscape-text mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-medscape-gray group-focus-within:text-medscape-blue transition-colors" />
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
          <div className="flex-1 h-px bg-medscape-border"></div>
          <span className="text-sm text-medscape-gray font-medium">Have an account?</span>
          <div className="flex-1 h-px bg-medscape-border"></div>
        </div>

        {/* Sign In Link */}
        <Link
          to="/login"
          className="w-full py-2.5 px-4 border border-medscape-border text-medscape-navy font-semibold rounded-md hover:bg-medscape-light focus:outline-none focus:ring-2 focus:ring-medscape-blue focus:ring-offset-2 transition-all text-center"
        >
          Sign In
        </Link>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-medscape-gray">
          By creating an account, you agree to our{' '}
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
