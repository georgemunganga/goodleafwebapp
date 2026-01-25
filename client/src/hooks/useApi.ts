/**
 * Custom React Hooks for API Calls
 * Provides reusable hooks for managing async API calls with loading and error states
 */

import { useState, useCallback, useEffect } from 'react';
import * as Types from '@/lib/api-types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Types.ApiError | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Types.ApiError) => void;
}

/**
 * Hook for making API calls with loading and error states
 */
export function useApi<T, P>(
  apiCall: (params: P) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (params: P) => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await apiCall(params);
        setState({ data: result, loading: false, error: null });
        options.onSuccess?.(result);
        return result;
      } catch (err: any) {
        const error: Types.ApiError = {
          code: err.code || 'UNKNOWN_ERROR',
          message: err.message || 'An error occurred',
          status: err.status || 500,
          details: err.details,
        };
        setState({ data: null, loading: false, error });
        options.onError?.(error);
        throw error;
      }
    },
    [apiCall, options]
  );

  return { ...state, execute };
}

/**
 * Hook for making API calls that execute immediately
 */
export function useApiQuery<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions & { dependencies?: any[] } = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const result = await apiCall();
        if (isMounted) {
          setState({ data: result, loading: false, error: null });
          options.onSuccess?.(result);
        }
      } catch (err: any) {
        if (isMounted) {
          const error: Types.ApiError = {
            code: err.code || 'UNKNOWN_ERROR',
            message: err.message || 'An error occurred',
            status: err.status || 500,
            details: err.details,
          };
          setState({ data: null, loading: false, error });
          options.onError?.(error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, options.dependencies || []);

  return state;
}

/**
 * Hook for authentication
 */
export function useAuth() {
  const [user, setUser] = useState<Types.LoginResponse['user'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Types.ApiError | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = useCallback(
    async (request: Types.LoginRequest) => {
      setLoading(true);
      setError(null);
      try {
        const { authService } = await import('@/lib/api-service');
        const response = await authService.login(request);
        if ('token' in response && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
        }
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
    const { authService } = require('@/lib/api-service');
    authService.logout();
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return { user, loading, error, login, logout, isAuthenticated: !!user };
}

/**
 * Hook for user profile
 */
export function useUserProfile() {
  const [profile, setProfile] = useState<Types.UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Types.ApiError | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { userService } = await import('@/lib/api-service');
        const data = await userService.getProfile();
        setProfile(data);
      } catch (err: any) {
        setError({
          code: err.code || 'FETCH_FAILED',
          message: err.message || 'Failed to fetch profile',
          status: err.status || 500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = useCallback(
    async (request: Types.UpdateProfileRequest) => {
      try {
        const { userService } = await import('@/lib/api-service');
        const response = await userService.updateProfile(request);
        setProfile(response.user);
        return response;
      } catch (err: any) {
        throw {
          code: err.code || 'UPDATE_FAILED',
          message: err.message || 'Failed to update profile',
          status: err.status || 500,
        };
      }
    },
    []
  );

  return { profile, loading, error, updateProfile };
}

/**
 * Hook for loan data
 */
export function useLoans() {
  const [loans, setLoans] = useState<Types.LoanDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Types.ApiError | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const { loanService } = await import('@/lib/api-service');
        const data = await loanService.getUserLoans();
        setLoans(data);
      } catch (err: any) {
        setError({
          code: err.code || 'FETCH_FAILED',
          message: err.message || 'Failed to fetch loans',
          status: err.status || 500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  return { loans, loading, error };
}

/**
 * Hook for single loan details
 */
export function useLoanDetails(loanId: string) {
  const [loan, setLoan] = useState<Types.LoanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Types.ApiError | null>(null);

  useEffect(() => {
    if (!loanId) return;

    const fetchLoan = async () => {
      try {
        const { loanService } = await import('@/lib/api-service');
        const data = await loanService.getLoanDetails(loanId);
        setLoan(data);
      } catch (err: any) {
        setError({
          code: err.code || 'FETCH_FAILED',
          message: err.message || 'Failed to fetch loan details',
          status: err.status || 500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [loanId]);

  return { loan, loading, error };
}

/**
 * Hook for repayment schedule
 */
export function useRepaymentSchedule(loanId: string) {
  const [schedule, setSchedule] = useState<Types.RepaymentSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Types.ApiError | null>(null);

  useEffect(() => {
    if (!loanId) return;

    const fetchSchedule = async () => {
      try {
        const { loanService } = await import('@/lib/api-service');
        const data = await loanService.getRepaymentSchedule(loanId);
        setSchedule(data);
      } catch (err: any) {
        setError({
          code: err.code || 'FETCH_FAILED',
          message: err.message || 'Failed to fetch repayment schedule',
          status: err.status || 500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [loanId]);

  return { schedule, loading, error };
}

/**
 * Hook for payment history
 */
export function usePaymentHistory(loanId: string) {
  const [payments, setPayments] = useState<Types.PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Types.ApiError | null>(null);

  useEffect(() => {
    if (!loanId) return;

    const fetchPayments = async () => {
      try {
        const { paymentService } = await import('@/lib/api-service');
        const data = await paymentService.getPaymentHistory(loanId);
        setPayments(data);
      } catch (err: any) {
        setError({
          code: err.code || 'FETCH_FAILED',
          message: err.message || 'Failed to fetch payment history',
          status: err.status || 500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [loanId]);

  return { payments, loading, error };
}
