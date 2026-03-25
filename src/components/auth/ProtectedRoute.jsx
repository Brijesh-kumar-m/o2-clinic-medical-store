
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute v2 — Production Grade
 * - Blocks unauthenticated users → redirect to login
 * - Blocks unauthorized roles → redirect to unauthorized
 * - Blocks unapproved doctors → redirect to approval-pending
 * - Shows full-screen spinner during auth initialization
 */
const ProtectedRoute = ({
  children,
  allowedRoles,
  unauthenticatedTo = '/login',
  unauthorizedTo = '/unauthorized',
  requiresApproval = true,
}) => {
  const { isAuthenticated, profile, loading } = useAuthStore();
  const location = useLocation();

  // Show spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-bg gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        </div>
        <p className="text-sm font-semibold text-txt-secondary animate-pulse">Verifying session...</p>
      </div>
    );
  }

  // Not authenticated → redirect to login page, preserving intended destination
  if (!isAuthenticated) {
    return (
      <Navigate
        to={unauthenticatedTo}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Role check: if allowedRoles is specified, user must have one of them
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to={unauthorizedTo} replace />;
  }

  // Approval check: non-admin users must be approved to access protected pages
  if (
    requiresApproval &&
    profile &&
    profile.role !== 'admin' &&
    profile.status !== 'approved'
  ) {
    // Don't redirect if already on the pending page (prevent loop)
    if (!location.pathname.includes('/approval-pending')) {
      return <Navigate to="/approval-pending" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
