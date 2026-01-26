import { useAuthContext } from '@/contexts/AuthContext';
import { paymentService } from '@/lib/api-service';
import { buildCacheKey } from '@/lib/persisted-cache';
import { queryKeys } from './query-keys';
import { usePersistentQuery } from './usePersistentQuery';

export function usePaymentHistory(loanId: string) {
  const { user, isAuthenticated } = useAuthContext();
  const storageKey = isAuthenticated && loanId
    ? buildCacheKey('payment-history', user?.id ?? 'me', loanId)
    : undefined;

  return usePersistentQuery({
    queryKey: queryKeys.payments.history(loanId),
    queryFn: async () => paymentService.getPaymentHistory(loanId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: isAuthenticated && Boolean(loanId),
    storageKey,
    persist: Boolean(storageKey),
  });
}
