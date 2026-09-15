import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const getDashboardByRole = (role) => {
  switch (role) {
    case 'patient':
      return '/patient-dashboard';
    case 'doctor':
      return '/doctor-dashboard';
    case 'receptionist':
      return '/receptionist-dashboard';
    case 'admin':
      return '/admin';
    default:
      return '/login';
  }
};

export function AdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to={getDashboardByRole(user.role)} replace />;
  }

  return children;
}
