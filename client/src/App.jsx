import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import store from './store/store';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';
import { useLazyGetCurrentUserQuery, useRefreshTokenMutation } from './services/authApi';
import { setAccessToken, setUser, logout } from './store/slices/authSlice';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PatientDashboard from './pages/PatientDashboard';
import PatientAppointmentsPage from './pages/PatientAppointmentsPage';
import PatientPrescriptionsPage from './pages/PatientPrescriptionsPage';
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function AppRoutes() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isRestoringSession, setIsRestoringSession] = useState(isAuthenticated && !user);
  const [fetchCurrentUser] = useLazyGetCurrentUserQuery();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      if (!isAuthenticated || user) {
        setIsRestoringSession(false);
        return;
      }

      setIsRestoringSession(true);

      try {
        const meResponse = await fetchCurrentUser().unwrap();
        if (cancelled) return;
        if (meResponse?.data) {
          dispatch(setUser(meResponse.data));
        }
        setIsRestoringSession(false);
        return;
      } catch {
        // fall through to refresh
      }

      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const normalizedRefreshToken =
          storedRefreshToken && storedRefreshToken !== 'undefined' && storedRefreshToken !== 'null'
            ? storedRefreshToken
            : undefined;

        const refreshResponse = await refreshTokenMutation(normalizedRefreshToken).unwrap();
        if (cancelled) return;

        const nextAccessToken = refreshResponse?.data?.accessToken;
        const nextRefreshToken = refreshResponse?.data?.refreshToken;

        if (nextAccessToken) {
          dispatch(setAccessToken(nextAccessToken));
        }

        if (nextRefreshToken) {
          localStorage.setItem('refreshToken', nextRefreshToken);
        }

        const meAfterRefresh = await fetchCurrentUser().unwrap();
        if (cancelled) return;

        if (meAfterRefresh?.data) {
          dispatch(setUser(meAfterRefresh.data));
        }
      } catch {
        if (!cancelled) {
          dispatch(logout());
        }
      } finally {
        if (!cancelled) {
          setIsRestoringSession(false);
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, dispatch, fetchCurrentUser, refreshTokenMutation]);

  if (isAuthenticated && !user && isRestoringSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-[#495057]">
        <p className="text-sm font-semibold">Restoring your session...</p>
      </div>
    );
  }

  return (
    <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage expectedRole={null} />} />
          <Route path="/login/patient" element={<LoginPage expectedRole={'patient'} />} />
          <Route path="/login/doctor" element={<LoginPage expectedRole={'doctor'} />} />
          <Route path="/login/receptionist" element={<LoginPage expectedRole={'receptionist'} />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes - Role-Specific Dashboards */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute>
                <PatientAppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/prescriptions"
            element={
              <ProtectedRoute>
                <PatientPrescriptionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist-dashboard"
            element={
              <ProtectedRoute>
                <ReceptionistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <SubscriptionPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}
