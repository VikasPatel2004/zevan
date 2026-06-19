import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import DiscoveryPage from './pages/DiscoveryPage'
import MessDetailsPage from './pages/MessDetailsPage'
import StudentDashboard from './pages/StudentDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { ROUTES } from './routes/routes'
import { Loader2 } from 'lucide-react'

/**
 * Smart landing — if already logged in, redirect to the correct dashboard
 * instead of showing the public landing page.
 */
function SmartLanding() {
  const { isAuthenticated, isReady, user } = useAuth();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    const dashboardRoute = user.role === 'OWNER' ? ROUTES.OWNER : ROUTES.STUDENT;
    return <Navigate to={dashboardRoute} replace />;
  }

  return <LandingPage />;
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.HOME} element={<SmartLanding />} />
      <Route path={ROUTES.DISCOVER} element={<DiscoveryPage />} />
      <Route path={ROUTES.MESS_DETAILS} element={<MessDetailsPage />} />

      {/* Protected routes — require authentication */}
      <Route
        path={ROUTES.STUDENT}
        element={
          <ProtectedRoute requiredRole="RESIDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.OWNER}
        element={
          <ProtectedRoute requiredRole="OWNER">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: redirect unknown routes to home */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  )
}

export default App
