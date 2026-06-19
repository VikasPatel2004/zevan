import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../routes/routes';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute — wraps dashboard pages.
 * If the user is not authenticated, redirects to the landing page.
 * Optionally checks for a specific role (OWNER / RESIDENT).
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isReady, user } = useAuth();

  // While AuthContext is loading from localStorage, show a spinner
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  // Not logged in → redirect to landing
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Role mismatch → redirect to the correct dashboard
  if (requiredRole && user?.role !== requiredRole) {
    const correctRoute = user?.role === 'OWNER' ? ROUTES.OWNER : ROUTES.STUDENT;
    return <Navigate to={correctRoute} replace />;
  }

  return children;
}
