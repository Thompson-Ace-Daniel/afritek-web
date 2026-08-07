import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';
import { ROUTES } from '../utils/constants';

export default function GuestRoute({ children }) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  if (isAuthenticated) {
    const from = location.state?.from || ROUTES.DASHBOARD;
    return <Navigate to={from} replace />;
  }

  return children;
}
