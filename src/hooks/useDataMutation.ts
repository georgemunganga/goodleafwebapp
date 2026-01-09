// hooks/useDataMutation.ts
import { useState, useCallback } from 'react';

export type MutationFunction<TData, TVariables = void> = (variables: TVariables) => Promise<TData>;

interface UseDataMutationResult<TData, TVariables> {
  data: TData | null;
  loading: boolean;
  error: string | null;
  mutate: (variables: TVariables) => Promise<TData>;
}

export function useDataMutation<TData, TVariables = void>(
  mutationFn: MutationFunction<TData, TVariables>
): UseDataMutationResult<TData, TVariables> {
  const [state, setState] = useState<Omit<UseDataMutationResult<TData, TVariables>, 'mutate'>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await mutationFn(variables);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        throw error;
      }
    },
    [mutationFn]
  );

  return { ...state, mutate };
}

// Hook for queries (read operations)
export type QueryFunction<TData, TVariables = void> = (variables?: TVariables) => Promise<TData>;

interface UseDataQueryResult<TData> {
  data: TData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<TData>;
}

export function useDataQuery<TData, TVariables = void>(
  queryFn: QueryFunction<TData, TVariables>,
  variables?: TVariables,
  options: { enabled?: boolean } = { enabled: true }
): UseDataQueryResult<TData> {
  const [state, setState] = useState<Omit<UseDataQueryResult<TData>, 'refetch'>>({
    data: null,
    loading: options.enabled ?? true,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!options.enabled) return state.data as TData;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await queryFn(variables);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, [queryFn, variables, options.enabled]);

  // Run the query on mount if enabled
  useState(() => {
    if (options.enabled) {
      refetch().catch(console.error);
    }
  });

  return { ...state, refetch };
}