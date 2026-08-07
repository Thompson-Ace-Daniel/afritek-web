import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { ROUTES } from '../utils/constants';

export function useProtectedRoute(options = {}) {
  const { redirectTo = ROUTES.LOGIN, requireAuth = true } = options;
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (requireAuth && !isAuthenticated) {
      navigate(redirectTo, {
        replace: true,
        state: { from: location.pathname + location.search },
      });
    }

    if (!requireAuth && isAuthenticated) {
      const from = location.state?.from || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [
    isAuthenticated,
    isLoading,
    isInitialized,
    requireAuth,
    redirectTo,
    navigate,
    location,
  ]);

  return {
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
  };
}
