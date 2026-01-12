/**
 * Protected Route Component
 * Ensures only authenticated users can access certain routes
 * Redirects unauthenticated users to login
 */

import React from 'react';
import { useLocation } from 'wouter';
import { useAuthContext } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuthContext();
  const [, setLocation] = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner variant="spinner" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
