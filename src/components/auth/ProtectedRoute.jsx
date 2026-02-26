
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const ProtectedRoute = ({ children, allowedRoles, unauthenticatedTo = '/login', unauthorizedTo = '/unauthorized' }) => {
  const { isAuthenticated, user, profile, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={unauthenticatedTo} state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to={unauthorizedTo} replace />;
  }

  // Check for approval status if user is a doctor/pharmacy
  if (profile && profile.role !== 'admin' && profile.status !== 'approved') {
     // You might want a specific page for "Pending Approval"
     // For now, let's just show a message or redirect to a status page
     // if (!location.pathname.includes('/approval-pending')) {
     //    return <Navigate to="/approval-pending" replace />;
     // }
  }

  return children;
};

export default ProtectedRoute;
