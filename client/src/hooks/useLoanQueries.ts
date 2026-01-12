import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { loanService } from '@/lib/api-service';
import { queryKeys } from './query-keys';

/**
 * Loan Query Hooks
 * Centralized data fetching for loan-related queries with proper caching
 */

// Get all active loans for the current user
export function useActiveLoans() {
  return useQuery({
    queryKey: queryKeys.loans.active(),
    queryFn: async () => {
      const response = await loanService.getUserLoans();
      // Filter to only active loans
      return response.filter((loan: any) => 
        loan.status === 'active' || 
        loan.status === 'pending_approval' ||
        loan.status === 'approved_not_disbursed'
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get loan history (paginated)
export function useLoanHistory(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.loans.history(),
    queryFn: async () => {
      const response = await loanService.getUserLoans();
      // Return all loans for history
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get specific loan details
export function useLoanDetails(loanId: string) {
  return useQuery({
    queryKey: queryKeys.loans.detail(loanId),
    queryFn: async () => {
      const loans = await loanService.getUserLoans();
      return loans.find((loan: any) => loan.id === loanId);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!loanId, // Only run query if loanId is provided
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
