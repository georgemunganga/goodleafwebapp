import { useEffect } from 'react';
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import { readPersistedCache, writePersistedCache } from '@/lib/persisted-cache';

/**
 * Persistent Query Hook
 * Hydrates data from localStorage and keeps it updated.
 */

export type PersistentQueryOptions<TQueryFnData, TData = TQueryFnData, TError = unknown> =
  Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'initialData' | 'initialDataUpdatedAt'> & {
    storageKey?: string;
    persist?: boolean;
  };

export function usePersistentQuery<TQueryFnData, TData = TQueryFnData, TError = unknown>(
  options: PersistentQueryOptions<TQueryFnData, TData, TError>,
): UseQueryResult<TData, TError> {
  const { storageKey, persist = true, ...queryOptions } = options;
  const cached = storageKey && persist ? readPersistedCache<TData>(storageKey) : null;

  const queryResult = useQuery({
    ...queryOptions,
    ...(cached
      ? {
          initialData: cached.data,
          initialDataUpdatedAt: cached.updatedAt,
        }
      : {}),
  });

  useEffect(() => {
    if (!storageKey || !persist) return;
    if (typeof queryResult.data === 'undefined') return;
    writePersistedCache(storageKey, queryResult.data);
  }, [storageKey, persist, queryResult.data]);

  return queryResult;
}
