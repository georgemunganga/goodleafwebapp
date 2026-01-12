/**
 * Protected Route Component
 * Ensures only authenticated users can access certain routes
 * Redirects unauthenticated users to login
 */

import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthContext } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuthContext();
  const [, setLocation] = useLocation();

  // Use useEffect for redirect to avoid setState during render
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [loading, isAuthenticated, setLocation]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner variant="spinner" />
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner variant="spinner" />
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}
