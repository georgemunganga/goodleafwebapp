import { QueryClient } from '@tanstack/react-query';

/**
 * QueryClient Configuration
 * Centralized React Query setup with fintech-appropriate defaults
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes for most queries
      
      // Cache time: how long inactive data is kept in memory
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      
      // Retry strategy: retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for 5xx or network errors
        return failureCount < 3;
      },
      
      // Retry delay: exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Don't refetch on window focus for sensitive data
      refetchOnWindowFocus: false,
      
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
      
      // Don't refetch on reconnect for sensitive data
      refetchOnReconnect: false,
    },
    mutations: {
      // Mutations should retry less aggressively
      retry: 1,
      retryDelay: 1000,
    },
  },
});
