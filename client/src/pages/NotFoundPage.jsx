import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="text-red-600" size={48} />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">Page Not Found</h2>
          <p className="mt-4 text-gray-600">
            Sorry, the page you are looking for does not exist. It might have been moved or deleted.
          </p>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
