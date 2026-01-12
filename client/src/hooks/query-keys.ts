/**
 * Query Keys Factory
 * Centralized query key definitions for TanStack Query
 * Ensures consistency and makes cache invalidation predictable
 */

export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
    status: () => [...queryKeys.auth.all, 'status'] as const,
  },

  // Loan queries
  loans: {
    all: ['loans'] as const,
    lists: () => [...queryKeys.loans.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.loans.lists(), { filters }] as const,
    details: () => [...queryKeys.loans.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.loans.details(), id] as const,
    products: () => [...queryKeys.loans.all, 'products'] as const,
    offers: () => [...queryKeys.loans.all, 'offers'] as const,
    active: () => [...queryKeys.loans.all, 'active'] as const,
    history: () => [...queryKeys.loans.all, 'history'] as const,
  },

  // Repayment queries
  repayment: {
    all: ['repayment'] as const,
    schedule: (loanId: string) => [...queryKeys.repayment.all, 'schedule', loanId] as const,
    history: (loanId: string) => [...queryKeys.repayment.all, 'history', loanId] as const,
  },

  // KYC queries
  kyc: {
    all: ['kyc'] as const,
    status: () => [...queryKeys.kyc.all, 'status'] as const,
    documents: () => [...queryKeys.kyc.all, 'documents'] as const,
  },

  // Application queries
  application: {
    all: ['application'] as const,
    status: (appId: string) => [...queryKeys.application.all, 'status', appId] as const,
  },
};
