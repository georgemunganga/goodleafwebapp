/**
 * Auth Context
 * Manages global authentication state, session management, and security
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Types from '@/lib/api-types';
import { authService } from '@/lib/api-service';
import { sessionManager } from '@/lib/session-manager';
import { auditLogger, AuditEventType } from '@/lib/audit-logger';

interface AuthContextType {
  user: Types.LoginResponse['user'] | null;
  token: string | null;
  loading: boolean;
  error: Types.ApiError | null;
  isAuthenticated: boolean;
  login: (request: Types.LoginRequest) => Promise<Types.LoginResponse>;
  logout: () => void;
  clearError: () => void;
  refreshToken: () => Promise<boolean>;
  getSessionRemainingTime: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Types.LoginResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Types.ApiError | null>(null);

  // Initialize from session manager
  useEffect(() => {
    const initializeAuth = () => {
      if (sessionManager.isAuthenticated()) {
        const storedToken = sessionManager.getToken();
        const storedUser = sessionManager.getUser();
        setToken(storedToken);
        setUser(storedUser);
        sessionManager.resetSessionTimeout();
      }
      setLoading(false);
    };

    initializeAuth();

    // Setup activity listeners for session timeout
    const cleanup = sessionManager.setupActivityListeners();

    // Listen for session timeout event
    const handleSessionTimeout = () => {
      auditLogger.logSecurityEvent(
        AuditEventType.SESSION_TIMEOUT,
        'User session expired due to inactivity'
      );
      logout();
    };

    window.addEventListener('sessionTimeout', handleSessionTimeout);

    return () => {
      cleanup();
      window.removeEventListener('sessionTimeout', handleSessionTimeout);
    };
  }, []);

  const login = useCallback(
    async (request: Types.LoginRequest) => {
      setLoading(true);
      setError(null);
      try {
        auditLogger.logAuth(
          AuditEventType.LOGIN_ATTEMPT,
          request.phone || request.email || '',
          false
        );

        const response = await authService.login(request);
        
        // Save tokens and user data using session manager
        sessionManager.saveTokens(response.token, response.refreshToken);
        sessionManager.saveUser(response.user);

        setToken(response.token);
        setUser(response.user);

        auditLogger.logAuth(
          AuditEventType.LOGIN_SUCCESS,
          request.phone || request.email || '',
          true
        );

        return response;
      } catch (err: any) {
        const apiError: Types.ApiError = {
          code: err.code || 'LOGIN_FAILED',
          message: err.message || 'Login failed',
          status: err.status || 500,
        };
        setError(apiError);

        auditLogger.logAuth(
          AuditEventType.LOGIN_FAILED,
          request.phone || request.email || '',
          false,
          apiError.message
        );

        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    auditLogger.log(
      AuditEventType.LOGOUT,
      `User ${user?.id} logged out`,
      { userId: user?.id },
      'info'
    );

    authService.logout();
    sessionManager.clearSession();
    setToken(null);
    setUser(null);
  }, [user?.id]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    return sessionManager.refreshToken();
  }, []);

  const getSessionRemainingTime = useCallback((): number => {
    return sessionManager.getSessionRemainingTime();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    clearError,
    refreshToken,
    getSessionRemainingTime,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
