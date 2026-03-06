import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUpdateProfileMutation } from '../services/userApi';
import { ArrowLeft, Save } from 'lucide-react';
import ThemeSwitcher from '../components/ThemeSwitcher';

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
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <nav className="bg-card-background shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(getDashboardUrl())}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex-shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold truncate">Edit Profile</h1>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-4 rounded-md bg-success/10 p-4">
            <p className="text-sm text-success">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-md bg-danger/10 p-4">
            <p className="text-sm text-danger">{errorMessage}</p>
          </div>
        )}

        <div className="bg-card-background shadow rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-text-secondary">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className="mt-1 w-full px-3 py-2 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                />
                {errors.firstName && <p className="mt-1 text-sm text-danger">{errors.firstName.message}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-text-secondary">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className="mt-1 w-full px-3 py-2 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                />
                {errors.lastName && <p className="mt-1 text-sm text-danger">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                disabled
                value={user?.email || ''}
                className="mt-1 w-full px-3 py-2 border border-border-color rounded-md bg-gray-100 dark:bg-gray-800 text-text-secondary"
              />
              <p className="mt-1 text-xs text-text-secondary">Email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-text-secondary">
                Bio
              </label>
              <textarea
                id="bio"
                {...register('bio')}
                rows="4"
                className="mt-1 w-full px-3 py-2 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                placeholder="Tell us about yourself..."
              />
              {errors.bio && <p className="mt-1 text-sm text-danger">{errors.bio.message}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(getDashboardUrl())}
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
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
