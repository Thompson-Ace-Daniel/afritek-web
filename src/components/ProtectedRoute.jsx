import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';
import { ROUTES } from '../utils/constants';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isLoading, isInitialized, user } = useAuth();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return <LoadingScreen message="Checking session..." />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (roles && roles.length > 0) {
    const userRole = user?.role?.toLowerCase();
    const allowed = roles.map((r) => r.toLowerCase());
    if (userRole !== 'admin' && !allowed.includes(userRole)) {
      return <Navigate to={ROUTES.PROFILE} replace />;
    }
  }

  return children;
}
