import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUpdateProfileMutation } from '../services/userApi';
import { ArrowLeft, Save, CheckCircle, AlertCircle, User } from 'lucide-react';

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
    formState: { errors },
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
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-medscape-light">
      {/* Header */}
      <nav className="bg-white shadow-subtle sticky top-0 z-50 border-b border-medscape-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate(getDashboardUrl())}
              className="p-2 hover:bg-medscape-light rounded-md transition-colors flex-shrink-0 text-medscape-gray hover:text-medscape-text"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-medscape-navy truncate">My Profile</h1>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-sm text-success font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error font-medium">{errorMessage}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-soft border border-medscape-border p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-medscape-border">
            <div className="w-16 h-16 rounded-md bg-blue-100 flex items-center justify-center">
              <User className="text-medscape-navy" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-medscape-navy">{user?.firstName} {user?.lastName}</h2>
              <p className="text-sm text-medscape-gray capitalize">{user?.role} Account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-medscape-text mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className="w-full px-4 py-2.5 border border-medscape-border rounded-md text-medscape-text focus:border-medscape-blue focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none"
                />
                {errors.firstName && <p className="mt-1.5 text-sm text-error font-medium">{errors.firstName.message}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-medscape-text mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className="w-full px-4 py-2.5 border border-medscape-border rounded-md text-medscape-text focus:border-medscape-blue focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none"
                />
                {errors.lastName && <p className="mt-1.5 text-sm text-error font-medium">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-medscape-text mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 border border-medscape-border rounded-md bg-medscape-light text-medscape-gray cursor-not-allowed"
              />
              <p className="mt-2 text-xs text-medscape-gray">Email cannot be changed for security</p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-medscape-text mb-2">
                Professional Bio
              </label>
              <textarea
                id="bio"
                {...register('bio')}
                rows="4"
                className="w-full px-4 py-2.5 border border-medscape-border rounded-md text-medscape-text focus:border-medscape-blue focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none resize-none"
                placeholder="Tell us about yourself or your expertise..."
              />
              {errors.bio && <p className="mt-1.5 text-sm text-error font-medium">{errors.bio.message}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-medscape-navy text-white rounded-md hover:bg-primary disabled:opacity-60 disabled:cursor-not-allowed font-semibold transition-all shadow-soft hover:shadow-clinical"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(getDashboardUrl())}
                className="flex-1 px-6 py-3 bg-medscape-border text-medscape-text rounded-md hover:bg-medscape-gray hover:text-white font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
