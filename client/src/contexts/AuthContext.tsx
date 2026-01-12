/**
 * Auth Context
 * Manages global authentication state and user data
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Types from '@/lib/api-types';
import { authService } from '@/lib/api-service';

interface AuthContextType {
  user: Types.LoginResponse['user'] | null;
  token: string | null;
  loading: boolean;
  error: Types.ApiError | null;
  isAuthenticated: boolean;
  login: (request: Types.LoginRequest) => Promise<Types.LoginResponse>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Types.LoginResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Types.ApiError | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (request: Types.LoginRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authService.login(request);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        return response;
      } catch (err: any) {
        const apiError: Types.ApiError = {
          code: err.code || 'LOGIN_FAILED',
          message: err.message || 'Login failed',
          status: err.status || 500,
        };
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    authService.logout();
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
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
