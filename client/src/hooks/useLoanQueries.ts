import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { loanService } from '@/lib/api-service';
import { useAuthContext } from '@/contexts/AuthContext';
import * as Types from '@/lib/api-types';
import { queryKeys } from './query-keys';
import { usePersistentQuery } from './usePersistentQuery';
import { buildCacheKey } from '@/lib/persisted-cache';

/**
 * Loan Query Hooks
 * Centralized data fetching for loan-related queries with proper caching
 */

// Get all loans for the current user (with local persistence)
export function useUserLoans() {
  const { user, isAuthenticated } = useAuthContext();
  const cacheKey = isAuthenticated ? buildCacheKey('loans', [user?.id ?? 'me']) : undefined;

  return usePersistentQuery({
    queryKey: queryKeys.loans.list({ userId: user?.id }),
    queryFn: async () => loanService.getUserLoans(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: isAuthenticated,
    storageKey: cacheKey,
    persist: Boolean(cacheKey),
  });
}

// Get all active loans for the current user
export function useActiveLoans() {
  const loansQuery = useUserLoans();
  const activeLoans = useMemo(() => {
    const loans = loansQuery.data ?? [];
    return loans.filter((loan) =>
      loan.status === 'active' ||
      loan.status === 'pending_approval' ||
      loan.status === 'approved_not_disbursed'
    );
  }, [loansQuery.data]);

  return {
    ...loansQuery,
    data: activeLoans,
  };
}

// Get loan history (paginated)
export function useLoanHistory(page = 1, limit = 10) {
  const loansQuery = useUserLoans();
  const loanHistory = useMemo(() => {
    return loansQuery.data ?? [];
  }, [loansQuery.data]);

  return {
    ...loansQuery,
    data: loanHistory,
  };
}

// Get specific loan details
export function useLoanDetails(loanId: string) {
  return useQuery({
    queryKey: queryKeys.loans.detail(loanId),
    queryFn: async () => {
      return loanService.getLoanDetails(loanId);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!loanId, // Only run query if loanId is provided
  });
}

// Get repayment schedule for a loan
export function useRepaymentSchedule(loanId: string) {
  return useQuery({
    queryKey: queryKeys.repayment.schedule(loanId),
    queryFn: async () => {
      return loanService.getRepaymentSchedule(loanId);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!loanId,
  });
}

// Get available loan config/products
export function useLoanConfig() {
  return usePersistentQuery({
    queryKey: queryKeys.loans.config(),
    queryFn: async () => loanService.getLoanConfig(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    storageKey: buildCacheKey('loan-config'),
  });
}

// Get available loan products
export function useLoanProducts() {
  return useQuery({
    queryKey: queryKeys.loans.products(),
    queryFn: async () => {
      // This would typically call an API endpoint
      // For now, return mock data
      return [
        {
          id: 'personal',
          name: 'Personal Loan',
          minAmount: 5000,
          maxAmount: 50000,
          minTerm: 6,
          maxTerm: 60,
          interestRate: 15,
        },
        {
          id: 'business',
          name: 'Business Loan',
          minAmount: 10000,
          maxAmount: 100000,
          minTerm: 12,
          maxTerm: 84,
          interestRate: 18,
        },
      ];
    },
    staleTime: 1 * 60 * 60 * 1000, // 1 hour - products change infrequently
  });
}

// Get personalized loan offers
export function useLoanOffers() {
  return useQuery({
    queryKey: queryKeys.loans.offers(),
    queryFn: async () => {
      // This would typically call an API endpoint
      return [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}
