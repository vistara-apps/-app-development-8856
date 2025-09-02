import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Private route component that redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @returns {React.ReactNode} - The rendered component
 */
const PrivateRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If authentication is required but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    // Save the current location to redirect back after login
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }
  
  // If authentication is not required but user is authenticated, render children
  // This is useful for routes like login/signup that should redirect to dashboard if already logged in
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/app" replace />;
  }
  
  // Render children if authentication requirements are met
  return children;
};

export default PrivateRoute;
