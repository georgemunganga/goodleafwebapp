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
    config: () => [...queryKeys.loans.all, 'config'] as const,
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
    status: (userId?: string) => [...queryKeys.kyc.all, 'status', userId ?? 'me'] as const,
    documents: () => [...queryKeys.kyc.all, 'documents'] as const,
  },

  // Application queries
  application: {
    all: ['application'] as const,
    status: (appId: string) => [...queryKeys.application.all, 'status', appId] as const,
  },

  // User profile queries
  user: {
    all: ['user'] as const,
    profile: (userId?: string) => [...queryKeys.user.all, 'profile', userId ?? 'me'] as const,
  },

  // Notifications queries
  notifications: {
    all: ['notifications'] as const,
    settings: (userId?: string) => [...queryKeys.notifications.all, 'settings', userId ?? 'me'] as const,
  },

  // Security queries
  security: {
    all: ['security'] as const,
    settings: (userId?: string) => [...queryKeys.security.all, 'settings', userId ?? 'me'] as const,
    sessions: (userId?: string) => [...queryKeys.security.all, 'sessions', userId ?? 'me'] as const,
  },

  // Payment queries
  payments: {
    all: ['payments'] as const,
    history: (loanId: string) => [...queryKeys.payments.all, 'history', loanId] as const,
  },
};
